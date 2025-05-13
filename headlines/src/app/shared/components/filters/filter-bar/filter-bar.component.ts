// src/app/shared/components/filters/filter-bar/filter-bar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

export interface DateRangeOption {
  label: string;
  value: string;
  days?: number;
  custom?: boolean;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  template: `
    <div class="filter-bar">
      <!-- Date range filter -->
      <button class="filter-item date-filter" [matMenuTriggerFor]="dateMenu">
        <span>{{ selectedDateRange }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #dateMenu="matMenu" class="filter-menu">
        <button mat-menu-item *ngFor="let option of dateRangeOptions" 
                (click)="selectDateRange(option)">
          {{ option.label }}
        </button>
      </mat-menu>
      
      <div class="divider"></div>
      
      <!-- Model filter -->
      <button class="filter-item model-filter" [matMenuTriggerFor]="modelMenu" 
              [disabled]="!models || models.length === 0">
        <span>{{ selectedModelName || 'Models' }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #modelMenu="matMenu" class="filter-menu">
        <button mat-menu-item *ngFor="let model of models" 
                (click)="selectModel(model)">
          {{ model.name }}
        </button>
      </mat-menu>
      
      <!-- Suite filter -->
      <button class="filter-item suite-filter" [matMenuTriggerFor]="suiteMenu"
              [disabled]="!suites || suites.length === 0">
        <span>{{ selectedSuiteName || 'Suites' }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>
      <mat-menu #suiteMenu="matMenu" class="filter-menu">
        <button mat-menu-item *ngFor="let suite of suites" 
                (click)="selectSuite(suite)">
          {{ suite.name }}
        </button>
      </mat-menu>
      
      <div class="spacer"></div>
      
      <!-- Refresh button -->
      <button class="refresh-button" (click)="refresh()" [disabled]="isRefreshing">
        <mat-icon [class.rotating]="isRefreshing">refresh</mat-icon>
      </button>
      
      <!-- Help button -->
      <button class="help-button" (click)="toggleHelp()">
        <mat-icon>help_outline</mat-icon>
      </button>
    </div>
    
    <!-- Help tooltip -->
    <div class="help-tooltip" *ngIf="showHelp">
      <div class="tooltip-content">
        <div class="tooltip-header">
          <h3>Dashboard Help</h3>
          <button class="close-tooltip" (click)="toggleHelp()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <p>This dashboard displays test metrics and results for your selected model.</p>
        <ul>
          <li><strong>Date Range</strong>: Filter data by time period</li>
          <li><strong>Models</strong>: Select a specific model to view</li>
          <li><strong>Suites</strong>: Filter by test suite</li>
          <li><strong>Refresh</strong>: Update the dashboard with latest data</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: var(--border-radius);
      padding: 8px 16px;
      margin-bottom: 16px;
      box-shadow: var(--shadow);
    }
    
    .filter-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      border: none;
      background: none;
      color: var(--text-color);
      font-size: 14px;
      
      &:hover:not([disabled]) {
        background-color: rgba(0, 0, 0, 0.04);
      }
      
      &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      span {
        margin-right: 4px;
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
    
    .divider {
      width: 1px;
      height: 24px;
      background-color: #e0e0e0;
      margin: 0 8px;
    }
    
    .spacer {
      flex: 1;
    }
    
    .refresh-button, .help-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: none;
      color: var(--primary-color);
      cursor: pointer;
      
      &:hover:not([disabled]) {
        background-color: rgba(95, 75, 139, 0.1);
      }
      
      &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
      
      .rotating {
        animation: rotate 1.5s linear infinite;
      }
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Help tooltip */
    .help-tooltip {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .tooltip-content {
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      width: 400px;
      max-width: 90%;
      padding: 16px;
    }
    
    .tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        color: var(--primary-color);
      }
      
      .close-tooltip {
        border: none;
        background: none;
        color: var(--text-secondary);
        cursor: pointer;
        
        &:hover {
          color: var(--text-color);
        }
      }
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
      }
    }
  `]
})
export class FilterBarComponent {
  @Input() selectedDateRange: string = 'Last 7 days';
  @Input() selectedModelName: string = '';
  @Input() selectedSuiteName: string = '';
  @Input() models: any[] = [];
  @Input() suites: any[] = [];
  @Input() isRefreshing: boolean = false;
  
  @Output() dateRangeChanged = new EventEmitter<DateRangeOption>();
  @Output() modelChanged = new EventEmitter<any>();
  @Output() suiteChanged = new EventEmitter<any>();
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() helpClicked = new EventEmitter<void>();
  
  showHelp: boolean = false;
  
  dateRangeOptions: DateRangeOption[] = [
    { label: 'Today', value: 'today', days: 1 },
    { label: 'Yesterday', value: 'yesterday', days: 1 },
    { label: 'Last 3 days', value: 'last-3-days', days: 3 },
    { label: 'Last 7 days', value: 'last-7-days', days: 7 },
    { label: 'Last 2 weeks', value: 'last-2-weeks', days: 14 },
    { label: 'Last month', value: 'last-month', days: 30 },
    { label: 'Custom range', value: 'custom', custom: true }
  ];
  
  selectDateRange(option: DateRangeOption): void {
    this.selectedDateRange = option.label;
    this.dateRangeChanged.emit(option);
  }
  
  selectModel(model: any): void {
    this.selectedModelName = model.name;
    this.modelChanged.emit(model);
  }
  
  selectSuite(suite: any): void {
    this.selectedSuiteName = suite.name;
    this.suiteChanged.emit(suite);
  }
  
  refresh(): void {
    this.refreshClicked.emit();
  }
  
  toggleHelp(): void {
    this.showHelp = !this.showHelp;
    this.helpClicked.emit();
  }
}