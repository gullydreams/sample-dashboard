// src/app/shared/components/charts/google-pie-chart/google-pie-chart.component.ts
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-google-pie-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="variable-pie-container">
      <svg #chartSvg class="chart-svg" [attr.width]="svgWidth" [attr.height]="svgHeight">
        <!-- Pie slices -->
        <g [attr.transform]="'translate(' + centerX + ',' + centerY + ')'">
          <path 
            *ngFor="let slice of slices; let i = index"
            [attr.d]="slice.path"
            [attr.fill]="slice.color"
            [attr.stroke]="'#fff'"
            [attr.stroke-width]="2"
            class="pie-slice"
            (mouseenter)="onSliceHover(slice, i, $event)"
            (mouseleave)="onSliceOut(slice, i, $event)"
            (click)="onSliceClick(slice, i, $event)"
            [style.cursor]="'pointer'"
          />
        </g>
        
        <!-- Option 1: Short connectors (when showConnectors is true) -->
        <g *ngIf="showConnectors">
          <g *ngFor="let slice of slices">
            <!-- Short connector line -->
            <line 
              [attr.x1]="slice.connectorStartX"
              [attr.y1]="slice.connectorStartY"
              [attr.x2]="slice.connectorEndX"
              [attr.y2]="slice.connectorEndY"
              stroke="#999" 
              stroke-width="1.5"
              class="connector-line">
            </line>
            
            <!-- Labels at connector end -->
            <text 
              [attr.x]="slice.textX" 
              [attr.y]="slice.textY - 8"
              [attr.text-anchor]="slice.textAnchor"
              class="label-percentage"
              fill="#333"
              font-family="Roboto, sans-serif"
              font-size="14"
              font-weight="bold">
              {{ slice.percentage }}%
            </text>
            
            <text 
              [attr.x]="slice.textX" 
              [attr.y]="slice.textY + 8"
              [attr.text-anchor]="slice.textAnchor"
              class="label-description"
              fill="#666"
              font-family="Roboto, sans-serif"
              font-size="10">
              {{ slice.label }}: {{ slice.value }}
            </text>
          </g>
        </g>
        
        <!-- Option 2: No connectors, just positioned labels -->
        <g *ngIf="!showConnectors">
          <g *ngFor="let slice of slices">
            <!-- Labels positioned around the chart -->
            <text 
              [attr.x]="slice.labelX" 
              [attr.y]="slice.labelY - 6"
              [attr.text-anchor]="slice.labelAnchor"
              class="label-percentage"
              fill="#333"
              font-family="Roboto, sans-serif"
              font-size="14"
              font-weight="bold">
              {{ slice.percentage }}%
            </text>
            
            <text 
              [attr.x]="slice.labelX" 
              [attr.y]="slice.labelY + 10"
              [attr.text-anchor]="slice.labelAnchor"
              class="label-description"
              fill="#666"
              font-family="Roboto, sans-serif"
              font-size="10">
              {{ slice.label }}: {{ slice.value }}
            </text>
          </g>
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div 
        *ngIf="hoveredSlice" 
        class="tooltip"
        [style.left.px]="tooltipX"
        [style.top.px]="tooltipY"
      >
        <div class="tooltip-title">{{ hoveredSlice.label }}</div>
        <div class="tooltip-value">Value: {{ hoveredSlice.value }}</div>
        <div class="tooltip-percentage">{{ hoveredSlice.percentage }}%</div>
      </div>
      
      <div *ngIf="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <span>Loading chart...</span>
      </div>
    </div>
  `,
    styles: [`
    .variable-pie-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chart-svg {
      position: relative;
      z-index: 1;
      overflow: visible;
    }
    
    .pie-slice {
      transition: all 0.3s ease;
    }
    
    .pie-slice:hover {
      filter: brightness(1.1);
      transform: scale(1.02);
      transform-origin: center;
    }
    
    .connector-line {
      pointer-events: none;
    }
    
    .label-percentage {
      pointer-events: none;
    }
    
    .label-description {
      pointer-events: none;
    }
    
    .tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    
    .tooltip-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .tooltip-value, .tooltip-percentage {
      margin: 2px 0;
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
    @ViewChild('chartSvg', { static: true }) chartSvg!: ElementRef;

    @Input() data: number[] = [];
    @Input() labels: string[] = [];
    @Input() colors: string[] = [];
    @Input() title: string = '';
    @Input() is3D: boolean = false;
    @Input() showLegend: boolean = true;
    @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' | 'none' = 'bottom';
    @Input() backgroundColor: string = 'transparent';
    @Input() pieSliceText: 'percentage' | 'value' | 'label' | 'none' = 'none';
    @Input() showDataLabels: boolean = true;
    @Input() showBothValueAndPercentage: boolean = true;
    @Input() showConnectors: boolean = false; // New input to control connector display

    isLoading = true;
    slices: any[] = [];
    svgWidth = 320;
    svgHeight = 280;
    centerX = 160;
    centerY = 140;

    // Tooltip state
    hoveredSlice: any = null;
    tooltipX = 0;
    tooltipY = 0;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.isLoading = false;
            this.calculateChart();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['labels'] || changes['colors'] || changes['showConnectors']) {
            this.calculateChart();
        }
    }

    private calculateChart(): void {
        if (!this.data.length || !this.labels.length) return;

        // Filter out zero values and sort by priority
        const priorityOrder = ['Failed', 'Error', 'Cancelled', 'Passed'];
        const dataWithLabels = this.data.map((value, index) => ({
            value,
            label: this.labels[index],
            color: this.colors[index] || this.getDefaultColor(index),
            priority: priorityOrder.indexOf(this.labels[index])
        }))
            .filter(item => item.value > 0)
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority === -1 ? 1 : b.priority === -1 ? -1 : a.priority - b.priority;
                }
                return b.value - a.value;
            });

        const total = dataWithLabels.reduce((sum, item) => sum + item.value, 0);

        this.slices = [];
        let currentAngle = 0;
        const baseRadius = 45;
        const maxRadius = 80;

        dataWithLabels.forEach((item, index) => {
            const percentage = (item.value / total) * 100;
            const sliceAngle = (item.value / total) * 360;

            // Variable radius based on priority
            let radius;
            switch (item.priority) {
                case 0: // Failed - largest radius
                    radius = maxRadius;
                    break;
                case 1: // Error - second largest
                    radius = maxRadius * 0.85;
                    break;
                case 2: // Cancelled - medium
                    radius = maxRadius * 0.7;
                    break;
                case 3: // Passed - smallest (but still visible)
                    radius = maxRadius * 0.6;
                    break;
                default:
                    radius = baseRadius;
            }

            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;

            // Create SVG path for variable radius slice
            const path = this.createVariableRadiusPath(startAngle, endAngle, radius);

            // Calculate label position
            const midAngle = startAngle + (sliceAngle / 2);
            const midAngleRad = (midAngle - 90) * (Math.PI / 180);

            if (this.showConnectors) {
                // Option 1: Short connectors
                const connectorStartX = this.centerX + Math.cos(midAngleRad) * (radius + 3);
                const connectorStartY = this.centerY + Math.sin(midAngleRad) * (radius + 3);

                const connectorLength = 25; // Short, fixed length
                const connectorEndX = this.centerX + Math.cos(midAngleRad) * (radius + connectorLength);
                const connectorEndY = this.centerY + Math.sin(midAngleRad) * (radius + connectorLength);

                const isRightSide = midAngle >= 270 || midAngle < 90;
                const textX = isRightSide ? connectorEndX + 5 : connectorEndX - 5;

                this.slices.push({
                    ...item,
                    path,
                    percentage: percentage.toFixed(1),
                    startAngle,
                    endAngle,
                    radius,
                    connectorStartX,
                    connectorStartY,
                    connectorEndX,
                    connectorEndY,
                    textX: textX,
                    textY: connectorEndY,
                    textAnchor: isRightSide ? 'start' : 'end'
                });
            } else {
                // Option 2: No connectors, just positioned labels
                const labelDistance = radius + 30;
                const labelX = this.centerX + Math.cos(midAngleRad) * labelDistance;
                const labelY = this.centerY + Math.sin(midAngleRad) * labelDistance;

                const isRightSide = midAngle >= 270 || midAngle < 90;

                this.slices.push({
                    ...item,
                    path,
                    percentage: percentage.toFixed(1),
                    startAngle,
                    endAngle,
                    radius,
                    labelX: labelX,
                    labelY: labelY,
                    labelAnchor: isRightSide ? 'start' : 'end'
                });
            }

            currentAngle += sliceAngle;
        });
    }

    private createVariableRadiusPath(startAngle: number, endAngle: number, radius: number): string {
        const startAngleRad = (startAngle - 90) * (Math.PI / 180);
        const endAngleRad = (endAngle - 90) * (Math.PI / 180);

        const x1 = Math.cos(startAngleRad) * radius;
        const y1 = Math.sin(startAngleRad) * radius;
        const x2 = Math.cos(endAngleRad) * radius;
        const y2 = Math.sin(endAngleRad) * radius;

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", 0, 0,
            "L", x1, y1,
            "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
            "Z"
        ].join(" ");
    }

    private getDefaultColor(index: number): string {
        const defaultColors = ['#4CAF50', '#F44336', '#FF9800', '#9E9E9E'];
        return defaultColors[index % defaultColors.length];
    }

    onSliceHover(slice: any, index: number, event: MouseEvent): void {
        this.hoveredSlice = slice;
        const rect = this.chartSvg.nativeElement.getBoundingClientRect();
        this.tooltipX = event.clientX - rect.left + 10;
        this.tooltipY = event.clientY - rect.top - 10;
    }

    onSliceOut(slice: any, index: number, event: MouseEvent): void {
        this.hoveredSlice = null;
    }

    onSliceClick(slice: any, index: number, event: MouseEvent): void {
        console.log('Slice clicked:', slice);
    }

    public refresh(): void {
        this.calculateChart();
    }
}