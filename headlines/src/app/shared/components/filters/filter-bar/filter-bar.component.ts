// src/app/shared/components/filters/filter-bar/filter-bar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="filter-bar">
      <div class="filter-item date-filter">
        <span>{{ selectedDateRange }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </div>
      
      <div class="divider"></div>
      
      <div class="filter-item model-filter">
        <span>{{ selectedModel || 'Models' }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </div>
      
      <div class="filter-item suite-filter">
        <span>{{ selectedSuite || 'Suites' }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </div>
      
      <div class="spacer"></div>
      
      <div class="help-button">
        <mat-icon>help_outline</mat-icon>
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
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
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
    
    .help-button {
      cursor: pointer;
      color: var(--primary-color);
    }
  `]
})
export class FilterBarComponent {
  @Input() selectedDateRange: string = 'Last 7 days';
  @Input() selectedModel: string = '';
  @Input() selectedSuite: string = '';
}