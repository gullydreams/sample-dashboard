import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FilterBarComponent } from '../../../../shared/components/filters/filter-bar/filter-bar.component';
import { DonutChartComponent } from '../../../../shared/components/charts/donut-chart/donut-chart.component';
import { BarChartComponent } from '../../../../shared/components/charts/bar-chart/bar-chart.component';
import { CoverageDataService } from '../../../../core/services/coverage-data.service';
import { ModelDataService } from '../../../../core/services/model-data.service';

@Component({
  selector: 'app-exploratory-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FilterBarComponent,
    DonutChartComponent,
    BarChartComponent
  ],
  templateUrl: './exploratory-dashboard.component.html',
  styleUrls: ['./exploratory-dashboard.component.scss']
})
export class ExploratoryDashboardComponent implements OnInit {
  // Selected model
  selectedModelId = 'model-001';
  selectedModel: any = null;
  
  // Coverage data
  coverageData: any = {};
  
  // Loading states
  isLoading = true;
  sectionsLoading = {
    model: true,
    bugHunting: true,
    coverage: true,
    testCases: true,
    testResults: true
  };
  
  // Chart data for donut charts
  modelChartData: number[] = [];
  modelChartLabels: string[] = [];
  modelChartColors: string[] = [];
  
  testCasesChartData: number[] = [];
  testCasesChartLabels: string[] = [];
  testCasesChartColors: string[] = [];
  
  testResultsChartData: number[] = [];
  testResultsChartLabels: string[] = [];
  testResultsChartColors: string[] = [];
  
  // Bar chart data for coverage
  coverageBarData: any = {};

  constructor(
    private coverageDataService: CoverageDataService,
    private modelDataService: ModelDataService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load model information
    this.modelDataService.getModelData(this.selectedModelId).subscribe(model => {
      this.selectedModel = model;
      this.sectionsLoading.model = false;
      this.checkLoadingComplete();
    });
    
    // Load coverage data
    this.coverageDataService.getModelCoverage(this.selectedModelId).subscribe(coverage => {
      this.coverageData = coverage;
      this.prepareChartData();
      this.sectionsLoading.bugHunting = false;
      this.sectionsLoading.coverage = false;
      this.sectionsLoading.testCases = false;
      this.sectionsLoading.testResults = false;
      this.checkLoadingComplete();
    });
  }
  
  private checkLoadingComplete(): void {
    // Check if all sections are done loading
    if (!Object.values(this.sectionsLoading).some(loading => loading)) {
      this.isLoading = false;
    }
  }

  private prepareChartData(): void {
    // Prepare model chart data
    this.modelChartData = [
      this.coverageData.modelInfo.automatedActions,
      this.coverageData.modelInfo.totalActions - this.coverageData.modelInfo.automatedActions
    ];
    
    this.modelChartLabels = ['Automated actions', 'Unautomated actions'];
    
    this.modelChartColors = [
      '#5F4B8B', // Primary color (purple) for automated
      '#E0E0E0'  // Gray for unautomated
    ];
    
    // Prepare test cases chart data
    this.testCasesChartData = [
      this.coverageData.testCases.run,
      this.coverageData.testCases.notRun
    ];
    
    this.testCasesChartLabels = ['Test Cases Run', 'Test Cases Not Run'];
    
    this.testCasesChartColors = [
      '#81D4FA', // Light blue for run
      '#E0E0E0'  // Gray for not run
    ];
    
    // Prepare test results chart data
    this.testResultsChartData = [
      this.coverageData.testResults.pass,
      this.coverageData.testResults.fail,
      this.coverageData.testResults.error,
      this.coverageData.testResults.cancelled
    ];
    
    this.testResultsChartLabels = ['Pass', 'Fail', 'Error', 'Cancelled'];
    
    this.testResultsChartColors = [
      '#4CAF50', // Green for pass
      '#F44336', // Red for fail
      '#FF9800', // Orange for error
      '#9E9E9E'  // Gray for cancelled
    ];
    
    // Prepare coverage bar chart data
    this.coverageBarData = {
      labels: ['All Nodes', 'All Pairs', 'Extended', 'Full Exploratory'],
      datasets: [{
        data: [
          this.coverageData.coverage.allNodes,
          this.coverageData.coverage.allPairs,
          this.coverageData.coverage.extended,
          this.coverageData.coverage.fullExploratory
        ],
        backgroundColor: [
          'rgba(95, 75, 139, 0.6)', // Primary color with opacity
          'rgba(129, 212, 250, 0.6)', // Light blue with opacity
          'rgba(186, 104, 200, 0.6)', // Purple with opacity
          'rgba(255, 193, 7, 0.6)'    // Amber with opacity
        ],
        borderColor: [
          'rgba(95, 75, 139, 1)',
          'rgba(129, 212, 250, 1)',
          'rgba(186, 104, 200, 1)',
          'rgba(255, 193, 7, 1)'
        ],
        borderWidth: 1
      }]
    };
  }
}