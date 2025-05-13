import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelDataService } from '../../../../core/services/model-data.service';
import { FilterBarComponent } from '../../../../shared/components/filters/filter-bar/filter-bar.component';
import { DonutChartComponent } from '../../../../shared/components/charts/donut-chart/donut-chart.component';
import { BarChartComponent } from '../../../../shared/components/charts/bar-chart/bar-chart.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-model-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FilterBarComponent,
    DonutChartComponent,
    BarChartComponent,
    MatIconModule
  ],
  templateUrl: './model-dashboard.component.html',
  styleUrls: ['./model-dashboard.component.scss']
})
export class ModelDashboardComponent implements OnInit {
  // Selected model ID (would come from route params in a real app)
  selectedModelId = 'model-001';
  
  // Model data
  modelData: any = {};
  testResults: any = {};
  
  // Loading state
  isLoading = true;
  
  // Chart data
  allRunsData: number[] = [];
  allRunsLabels: string[] = [];
  allRunsColors: string[] = [];
  
  completionData: number[] = [];
  completionLabels: string[] = [];
  completionColors: string[] = [];
  
  failureTypeData: number[] = [];
  failureTypeLabels: string[] = [];
  failureTypeColors: string[] = [];
  
  coverageData: number[] = [];
  coverageLabels: string[] = [];
  coverageColors: string[] = [];
  
  // Bar chart data for test breakdown
  testBreakdownData: any = {};

  constructor(private modelDataService: ModelDataService) {}

  ngOnInit(): void {
    this.loadModelData();
  }

  private loadModelData(): void {
    // Get model information
    this.modelDataService.getModelData(this.selectedModelId)
      .subscribe(model => {
        this.modelData = model;
      });
    
    // Get test results for the model
    this.modelDataService.getModelTestResults(this.selectedModelId)
      .subscribe(results => {
        this.testResults = results;
        this.prepareChartData();
        this.isLoading = false;
      });
  }

  private prepareChartData(): void {
    // All Runs chart data
    this.allRunsData = [
      this.testResults.allRuns.pass,
      this.testResults.allRuns.fail,
      this.testResults.allRuns.incomplete
    ];
    
    this.allRunsLabels = ['Pass', 'Fail', 'Incomplete'];
    
    this.allRunsColors = [
      '#81D4FA', // Light blue for pass
      '#F44336', // Red for fail
      '#FFA726'  // Orange for incomplete
    ];
    
    // Test Case Completion chart data
    this.completionData = [
      this.testResults.testCaseCompletion.completed,
      this.testResults.testCaseCompletion.incomplete
    ];
    
    this.completionLabels = ['Completed Test Cases', 'Incomplete Test Cases'];
    
    this.completionColors = [
      '#81D4FA', // Light blue for completed
      '#E0E0E0'  // Grey for incomplete
    ];
    
    // Failure Type chart data
    this.failureTypeData = [
      this.testResults.failureType.exploratoryFails,
      this.testResults.failureType.directedFails
    ];
    
    this.failureTypeLabels = ['Failed Exploratory Runs', 'Failed Directed Test Cases'];
    
    this.failureTypeColors = [
      '#FFA726', // Orange for exploratory
      '#F44336'  // Red for directed
    ];
    
    // Coverage chart data
    this.coverageData = [
      this.testResults.coverage.covered,
      this.testResults.coverage.remaining
    ];
    
    this.coverageLabels = ['Covered', 'Remaining'];
    
    this.coverageColors = [
      '#5F4B8B', // Purple for covered
      '#E0E0E0'  // Grey for remaining
    ];
    
    // Test breakdown data for bar chart
    if (this.testResults.testBreakdown && this.testResults.testBreakdown.length > 0) {
      const labels = this.testResults.testBreakdown.map((item: any) => item.name);
      const passData = this.testResults.testBreakdown.map((item: any) => item.passCount);
      const failData = this.testResults.testBreakdown.map((item: any) => item.failCount);
      
      this.testBreakdownData = {
        labels: labels,
        datasets: [
          {
            label: 'Directed Runs Pass',
            backgroundColor: '#81D4FA',
            data: passData
          },
          {
            label: 'Directed Runs Fail',
            backgroundColor: '#F44336',
            data: failData
          }
        ]
      };
    }
  }
}