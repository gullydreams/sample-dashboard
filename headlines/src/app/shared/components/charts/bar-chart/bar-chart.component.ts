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
  @Input() xAxisLabel: string = 'Number of Runs';
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
    const chartType: ChartType = this.horizontal ? 'bar' : 'bar';

    const config: ChartConfiguration = {
      type: chartType,
      data: {
        labels: this.chartData.labels,
        datasets: this.chartData.datasets
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
              text: this.xAxisLabel
            }
          },
          y: {
            stacked: true,
            title: {
              display: !!this.yAxisLabel,
              text: this.yAxisLabel
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'start'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}