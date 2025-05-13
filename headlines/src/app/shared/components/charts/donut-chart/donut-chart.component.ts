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
    if ((changes['data'] || changes['labels'] || changes['colors']) && this.chartCanvas) {
      this.initChart();
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

      // Set default colors if not provided
      const chartColors = this.colors.length > 0 ? this.colors : [
        '#4CAF50', // Green for success
        '#F44336', // Red for failure
        '#FF9800', // Orange for warning/error
        '#9E9E9E'  // Grey for cancelled
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
            // Add cutout here if needed
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: this.legendPosition,
              display: true
            },
            title: {
              display: !!this.title,
              text: this.title,
              font: {
                size: 16
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