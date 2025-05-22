// src/app/shared/components/charts/google-pie-chart/google-pie-chart.component.ts
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
    selector: 'app-google-pie-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="google-chart-container">
      <div #chartContainer class="chart-element"></div>
      <div *ngIf="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading chart...</span>
      </div>
    </div>
  `,
    styles: [`
    .google-chart-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 250px;
      overflow: visible;
    }
    
    .chart-element {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    
    .loading-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #666;
      font-size: 14px;
    }
    
    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class GooglePieChartComponent implements OnInit, OnChanges {
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

    @Input() data: number[] = [];
    @Input() labels: string[] = [];
    @Input() colors: string[] = [];
    @Input() title: string = '';
    @Input() is3D: boolean = true;
    @Input() showLegend: boolean = true;
    @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' | 'none' = 'bottom';
    @Input() backgroundColor: string = 'transparent';
    @Input() pieSliceText: 'percentage' | 'value' | 'label' | 'none' = 'percentage';
    @Input() showDataLabels: boolean = true;
    @Input() showBothValueAndPercentage: boolean = false;

    private chart: any;
    isLoading = true;
    private googleChartsLoaded = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.loadGoogleCharts();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.googleChartsLoaded && (changes['data'] || changes['labels'] || changes['colors'])) {
            this.drawChart();
        }
    }

    private loadGoogleCharts(): void {
        if (typeof google !== 'undefined' && google.charts) {
            this.onGoogleChartsLoaded();
            return;
        }

        // Load Google Charts
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
                this.onGoogleChartsLoaded();
            });
        };
        document.head.appendChild(script);
    }

    private onGoogleChartsLoaded(): void {
        this.googleChartsLoaded = true;
        this.isLoading = false;
        if (this.data.length > 0 && this.labels.length > 0) {
            this.drawChart();
        }
    }

    private drawChart(): void {
        if (!this.googleChartsLoaded || !this.chartContainer) {
            return;
        }

        // Prepare data for Google Charts
        const chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Category');
        chartData.addColumn('number', 'Count');

        const total = this.data.reduce((sum, val) => sum + val, 0);
        const rows = this.labels.map((label, index) => [label, this.data[index] || 0]);
        chartData.addRows(rows);

        // Chart options - removed the problematic TableNumberFormat
        const options = {
            title: this.title || '',
            titleTextStyle: {
                fontSize: 16,
                fontName: 'Roboto',
                bold: true,
                color: '#333'
            },
            is3D: this.is3D,
            backgroundColor: this.backgroundColor,

            // Show percentage on slices
            pieSliceText: this.showBothValueAndPercentage ? 'value-and-percentage' : this.pieSliceText,
            pieSliceTextStyle: {
                fontSize: 10,
                color: '#fff',
                bold: true,
                fontName: 'Roboto'
            },

            legend: {
                position: this.showLegend ? this.legendPosition : 'none',
                textStyle: {
                    fontSize: 12,
                    fontName: 'Roboto',
                    color: '#333'
                },
                alignment: 'center'
            },

            colors: this.colors.length > 0 ? this.colors : [
                '#4CAF50', '#F44336', '#FF9800', '#9E9E9E'
            ],

            pieHole: 0.0,
            sliceVisibilityThreshold: 0.01,
            pieStartAngle: 0,

            chartArea: {
                left: 20,
                top: this.title ? 40 : 20,
                width: '90%',
                height: this.showLegend && this.legendPosition === 'bottom' ? '75%' : '80%'
            },

            width: '100%',
            height: '100%',

            // Enhanced tooltip showing both value and percentage
            tooltip: {
                text: 'both', // Shows both value and percentage
                textStyle: {
                    fontSize: 13,
                    fontName: 'Roboto'
                },
                showColorCode: true
            },

            animation: {
                startup: true,
                duration: 1200,
                easing: 'inAndOut'
            },

            enableInteractivity: true,
            focusTarget: 'category'
        };

        this.chart = new google.visualization.PieChart(this.chartContainer.nativeElement);

        // Add event listeners for hover effects
        google.visualization.events.addListener(this.chart, 'onmouseover', (e: any) => {
            this.onSliceHover(e);
        });

        google.visualization.events.addListener(this.chart, 'onmouseout', (e: any) => {
            this.onSliceOut(e);
        });

        this.chart.draw(chartData, options);
    }

    private onSliceHover(e: any): void {
        if (this.chart && e.row !== null) {
            const element = this.chartContainer.nativeElement;
            element.style.cursor = 'pointer';
        }
    }

    private onSliceOut(e: any): void {
        if (this.chart && e.row !== null) {
            const element = this.chartContainer.nativeElement;
            element.style.cursor = 'default';
        }
    }

    // Public method to refresh the chart
    public refresh(): void {
        if (this.googleChartsLoaded) {
            this.drawChart();
        }
    }

    // Public method to export chart as image
    public getImageURI(): string {
        if (this.chart) {
            return this.chart.getImageURI();
        }
        return '';
    }
} 