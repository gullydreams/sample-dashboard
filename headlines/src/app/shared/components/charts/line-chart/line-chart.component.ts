// src/app/shared/components/charts/line-chart/line-chart.component.ts
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Input() datasets: any[] = [];
  @Input() labels: string[] = [];
  @Input() title: string = '';
  @Input() yAxisLabel: string = '';
  @Input() xAxisLabel: string = '';
  @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  chart: Chart | undefined;

  constructor() {}

  ngOnInit(): void {
    if (this.labels.length > 0 && this.datasets.length > 0) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['datasets'] || changes['labels']) && this.chartCanvas) {
      this.initChart();
    }
  }

  private initChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    setTimeout(() => {
      if (!this.chartCanvas) return;
      
      const ctx = this.chartCanvas.nativeElement.getContext('2d');

      // Chart configuration
      const config: ChartConfiguration = {
        type: 'line' as ChartType,
        data: {
          labels: this.labels,
          datasets: this.datasets.map(dataset => ({
            ...dataset,
            borderColor: dataset.borderColor || 'var(--primary-color)',
            backgroundColor: dataset.backgroundColor || 'rgba(95, 75, 139, 0.1)'
          }))
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
                // Fix for legend text color
                usePointStyle: true
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
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: !!this.yAxisLabel,
                text: this.yAxisLabel,
                color: 'var(--text-color)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              title: {
                display: !!this.xAxisLabel,
                text: this.xAxisLabel,
                color: 'var(--text-color)'
              },
              ticks: {
                color: 'var(--text-secondary)'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
    });
  }
}