// src/app/features/dashboard/test-case/test-case-dashboard/test-case-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestDataService } from '../../../../core/services/test-data.service';
import { MetricCardComponent } from '../../../../shared/components/cards/metric-card/metric-card.component';
import { DonutChartComponent } from '../../../../shared/components/charts/donut-chart/donut-chart.component';
import { LineChartComponent } from '../../../../shared/components/charts/line-chart/line-chart.component';

@Component({
  selector: 'app-test-case-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, DonutChartComponent, LineChartComponent],
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
  
  // Loading states
  isLoading = true;

  constructor(private testDataService: TestDataService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Get summary data
    this.testDataService.getTestResultsSummary().subscribe(summary => {
      this.summaryData = summary;
      this.prepareStatusChartData();
      this.isLoading = false;
    });
    
    // Get daily results data
    this.testDataService.getDailyTestResults().subscribe(dailyResults => {
      this.prepareDailyResultsChartData(dailyResults);
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
    
    this.statusChartColors = [
      'var(--success-color)',
      'var(--failure-color)',
      'var(--error-color)',
      '#9E9E9E'
    ];
  }

  private prepareDailyResultsChartData(dailyResults: any[]): void {
    // Extract labels (dates)
    this.dailyResultsLabels = dailyResults.map(result => result.date);
    
    // Prepare datasets
    this.dailyResultsDatasets = [
      {
        label: 'Passed',
        data: dailyResults.map(result => result.passed),
        borderColor: 'var(--success-color)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      },
      {
        label: 'Failed',
        data: dailyResults.map(result => result.failed),
        borderColor: 'var(--failure-color)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4
      },
      {
        label: 'Error',
        data: dailyResults.map(result => result.error),
        borderColor: 'var(--error-color)',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4
      },
      {
        label: 'Cancelled',
        data: dailyResults.map(result => result.cancelled),
        borderColor: '#9E9E9E',
        backgroundColor: 'rgba(158, 158, 158, 0.1)',
        tension: 0.4
      }
    ];
  }
}