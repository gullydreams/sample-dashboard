// src/app/features/dashboard/test-case/test-case-dashboard/test-case-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestDataService } from '../../../../core/services/test-data.service';
import { ModelDataService } from '../../../../core/services/model-data.service';
import { MetricCardComponent } from '../../../../shared/components/cards/metric-card/metric-card.component';
import { DonutChartComponent } from '../../../../shared/components/charts/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../../../shared/components/charts/line-chart/line-chart.component';
import { DataTableComponent } from '../../../../shared/components/tables/data-table/data-table.component';
import { FilterBarComponent } from '../../../../shared/components/filters/filter-bar/filter-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-test-case-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MetricCardComponent,
    DonutChartComponent,
    LineChartComponent,
    DataTableComponent,
    FilterBarComponent
  ],
  templateUrl: './test-case-dashboard.component.html',
  styleUrls: ['./test-case-dashboard.component.scss']
})
export class TestCaseDashboardComponent implements OnInit {
  // Summary data
  summaryData: any = {};

  // Chart data for status distribution
  statusChartData: number[] = [];
  statusChartLabels: string[] = [];
  statusChartColors: string[] = [];

  // Line chart data for daily results
  dailyResultsLabels: string[] = [];
  dailyResultsDatasets: any[] = [];

  // Table data
  longestRunningTestCases: any[] = [];
  topTestCaseFailures: any[] = [];
  topTestCaseErrors: any[] = [];

  // Filter state
  selectedDateRange: string = 'Last 7 days';
  selectedModel: any = null;
  selectedSuite: any = null;

  // Available models and suites
  availableModels: any[] = [];
  availableSuites: any[] = [];

  // Loading and error states
  isLoading = true;
  isRefreshing = false;
  hasError = false;
  errorMessage = '';

  tablesLoading = {
    longest: true,
    failures: true,
    errors: true
  };

  // Column definitions for tables
  longestRunningColumns = [
    { property: 'id', name: 'ID' },
    { property: 'name', name: 'Test Case' },
    {
      property: 'executionTime',
      name: 'Avg. Time',
      sortable: true,
      formatter: (value: number) => `${value} s`
    },
    {
      property: 'maxExecutionTime',
      name: 'Max. Time',
      sortable: true,
      formatter: (value: number, row: any) => `${value} s`
    },
    { property: 'model', name: 'Model/Suite' }
  ];

  failuresColumns = [
    { property: 'id', name: 'ID' },
    { property: 'name', name: 'Test Case' },
    {
      property: 'failures',
      name: 'Total Failures',
      sortable: true,
      cellClass: 'error-cell'
    },
    { property: 'model', name: 'Model/Suite' }
  ];

  errorsColumns = [
    { property: 'id', name: 'ID' },
    { property: 'name', name: 'Test Case' },
    {
      property: 'errors',
      name: 'Total Errors',
      sortable: true,
      cellClass: 'warning-cell'
    },
    { property: 'model', name: 'Model/Suite' }
  ];

  constructor(
    private testDataService: TestDataService,
    private modelDataService: ModelDataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadModelsAndSuites();
    this.loadDashboardData();
  }

  private loadModelsAndSuites(): void {
    this.modelDataService.getAvailableModels().subscribe({
      next: (models) => {
        this.availableModels = models;
        // For demo purposes, we'll create some mock suites
        this.availableSuites = [
          { id: 'suite-001', name: 'Regression Tests' },
          { id: 'suite-002', name: 'Smoke Tests' },
          { id: 'suite-003', name: 'Performance Tests' }
        ];
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.showErrorSnackbar('Failed to load models and suites.');
      }
    });
  }

  public loadDashboardData(forceRefresh: boolean = false): void {
    this.resetErrors();

    if (forceRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }

    // Prepare filters based on selection
    const filters = {
      dateRange: this.selectedDateRange,
      modelId: this.selectedModel?.id,
      suiteId: this.selectedSuite?.id
    };

    // Get summary data
    this.testDataService.getTestResultsSummary(filters, forceRefresh).subscribe({
      next: (summary) => {
        this.summaryData = summary;
        this.prepareStatusChartData();
      },
      error: (error) => {
        this.handleError('Failed to load summary data.', error);
      },
      complete: () => {
        if (forceRefresh) {
          this.isRefreshing = false;
        } else {
          this.isLoading = false;
        }
      }
    });

    // Get daily results data
    this.testDataService.getDailyTestResults(filters, forceRefresh).subscribe({
      next: (dailyResults) => {
        this.prepareDailyResultsChartData(dailyResults);
      },
      error: (error) => {
        this.handleError('Failed to load daily results data.', error);
      }
    });

    // Get longest running test cases
    this.tablesLoading.longest = true;
    this.testDataService.getLongestRunningTestCases(10, forceRefresh).subscribe({
      next: (testCases) => {
        this.longestRunningTestCases = testCases;
        this.tablesLoading.longest = false;
      },
      error: (error) => {
        this.handleError('Failed to load longest running test cases.', error);
        this.tablesLoading.longest = false;
      }
    });

    // Get top test case failures
    this.tablesLoading.failures = true;
    this.testDataService.getTopTestCaseFailures(10, forceRefresh).subscribe({
      next: (failures) => {
        this.topTestCaseFailures = failures;
        this.tablesLoading.failures = false;
      },
      error: (error) => {
        this.handleError('Failed to load top test case failures.', error);
        this.tablesLoading.failures = false;
      }
    });

    // Get top test case errors
    this.tablesLoading.errors = true;
    this.testDataService.getTopTestCaseErrors(10, forceRefresh).subscribe({
      next: (errors) => {
        this.topTestCaseErrors = errors;
        this.tablesLoading.errors = false;
      },
      error: (error) => {
        this.handleError('Failed to load top test case errors.', error);
        this.tablesLoading.errors = false;
      }
    });
  }

  private prepareStatusChartData(): void {
    this.statusChartData = [
      this.summaryData.passed,
      this.summaryData.failed,
      this.summaryData.error,
      this.summaryData.cancelled
    ];

    this.statusChartLabels = ['Passed', 'Failed', 'Error', 'Cancelled'];

    // Use explicit hex color values like in other working dashboards
    this.statusChartColors = [
      '#4CAF50', // Green for passed
      '#F44336', // Red for failed
      '#FF9800', // Orange for error
      '#9E9E9E'  // Grey for cancelled
    ];
  }

  private prepareDailyResultsChartData(dailyResults: any[]): void {
    // Extract labels (dates)
    this.dailyResultsLabels = dailyResults.map(result => result.date);

    // Prepare datasets with explicit colors instead of CSS variables
    this.dailyResultsDatasets = [
      {
        label: 'Passed',
        data: dailyResults.map(result => result.passed),
        borderColor: '#4CAF50', // Explicit green
        backgroundColor: 'rgba(76, 175, 80, 0.1)', // Transparent green
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Failed',
        data: dailyResults.map(result => result.failed),
        borderColor: '#F44336', // Explicit red
        backgroundColor: 'rgba(244, 67, 54, 0.1)', // Transparent red
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Error',
        data: dailyResults.map(result => result.error),
        borderColor: '#FF9800', // Explicit orange
        backgroundColor: 'rgba(255, 152, 0, 0.1)', // Transparent orange
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Cancelled',
        data: dailyResults.map(result => result.cancelled),
        borderColor: '#9E9E9E', // Explicit grey
        backgroundColor: 'rgba(158, 158, 158, 0.1)', // Transparent grey
        tension: 0.4,
        borderWidth: 2
      }
    ];
  }

  // Handler for filter-bar events
  onDateRangeChanged(option: any): void {
    this.selectedDateRange = option.label;
    this.loadDashboardData();
  }

  onModelChanged(model: any): void {
    this.selectedModel = model;
    this.loadDashboardData();
  }

  onSuiteChanged(suite: any): void {
    this.selectedSuite = suite;
    this.loadDashboardData();
  }

  onRefreshClicked(): void {
    this.loadDashboardData(true);
    this.showInfoSnackbar('Dashboard refreshed.');
  }

  onHelpClicked(): void {
    // This is handled by the filter bar component itself
  }

  onTestCaseClick(testCase: any): void {
    console.log('Test case clicked:', testCase);
    // In a real app, this would navigate to test case details
  }

  onViewAllClick(section: string): void {
    console.log(`View all clicked for section: ${section}`);
    // In a real app, this would navigate to a detailed view
  }

  private resetErrors(): void {
    this.hasError = false;
    this.errorMessage = '';
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.hasError = true;
    this.errorMessage = message;
    this.showErrorSnackbar(message);
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfoSnackbar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000
    });
  }
}