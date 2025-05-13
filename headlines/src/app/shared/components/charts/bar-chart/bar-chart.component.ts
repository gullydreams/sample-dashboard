// src/app/shared/components/charts/bar-chart/bar-chart.component.ts
import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @Input() chartData: any;
  @Input() xAxisLabel: string = '';
  @Input() yAxisLabel: string = '';
  @Input() horizontal: boolean = true;

  chart: Chart | undefined;

  ngOnChanges(): void {
    if (this.chartData && this.chartData.labels) {
      setTimeout(() => {
        this.initChart();
      }, 100);
    }
  }

  private initChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    // Configure chart
    const chartType: ChartType = 'bar';

    const config: ChartConfiguration = {
      type: chartType,
      data: {
        labels: this.chartData.labels,
        datasets: this.chartData.datasets.map((dataset: any) => ({
          ...dataset,
          // Ensure datasets use theme colors if not explicitly set
          backgroundColor: dataset.backgroundColor || 'var(--primary-color)'
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: this.horizontal ? 'y' : 'x',
        scales: {
          x: {
            stacked: true,
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
          },
          y: {
            stacked: true,
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
          }
        },
        plugins: {
          legend: {
            display: this.chartData.datasets.length > 1,
            position: 'top',
            align: 'start',
            labels: {
              color: 'var(--text-color)',
              font: {
                family: "'Roboto', sans-serif"
              },
              // Fix for legend text color
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label || ''}: ${context.parsed.y || context.parsed.x}%`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}