// src/app/shared/components/charts/donut-chart/donut-chart.component.ts
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() colors: string[] = [];
  @Input() title: string = '';
  @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  chart: Chart | undefined;

  constructor() {}

  ngOnInit(): void {
    // Initialize if data is available
    if (this.data.length > 0 && this.labels.length > 0) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update chart when inputs change
    if ((changes['data'] || changes['labels'] || changes['colors'])) {
      // Add a small delay to ensure the view is ready
      setTimeout(() => {
        this.initChart();
      }, 500);
    }
  }

  private initChart(): void {
    // Destroy previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Wait for the view to be initialized
    setTimeout(() => {
      if (!this.chartCanvas) return;
      
      const ctx = this.chartCanvas.nativeElement.getContext('2d');

      // Set default colors if not provided - using CSS variables for consistent theming
      const chartColors = this.colors.length > 0 ? this.colors : [
        'var(--success-color)', // Green for success
        'var(--failure-color)', // Red for failure
        'var(--error-color)',   // Orange for warning/error
        '#9E9E9E'              // Grey for cancelled
      ];

      // Chart configuration
      const config: ChartConfiguration = {
        type: 'doughnut' as ChartType,
        data: {
          labels: this.labels,
          datasets: [{
            data: this.data,
            backgroundColor: chartColors,
            hoverOffset: 4,
            borderWidth: 1,
            borderColor: '#FFFFFF'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: this.legendPosition,
              display: true,
              labels: {
                color: 'var(--text-color)',
                font: {
                  family: "'Roboto', sans-serif"
                },
                // Fix for the black color issue in legend with corrected TS errors
                generateLabels: (chart) => {
                  return chart.data.labels?.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    // Add the required 'active' parameter (false for inactive state)
                    const style = meta.controller.getStyle(i, false);
                    
                    return {
                      text: label as string,
                      // Use bracket notation for properties from index signature
                      fillStyle: style['backgroundColor'],
                      strokeStyle: style['borderColor'],
                      lineWidth: style['borderWidth'],
                      hidden: !chart.getDataVisibility(i),
                      index: i
                    };
                  }) || [];
                }
              }
            },
            title: {
              display: !!this.title,
              text: this.title,
              color: 'var(--text-color)',
              font: {
                size: 16,
                family: "'Roboto', sans-serif"
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((sum: number, val: any) => sum + val, 0);
                  const value = context.parsed;
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      } 

      this.chart = new Chart(ctx, config);
    });
  }
}