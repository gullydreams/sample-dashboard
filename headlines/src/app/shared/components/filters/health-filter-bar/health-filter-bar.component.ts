// src/app/shared/components/filters/health-filter-bar/health-filter-bar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Tenant, UseCase } from '../../../../core/services/tenant-data.service';

export interface DateRangeOption {
  label: string;
  value: string;
  days?: number;
  custom?: boolean;
}

@Component({
  selector: 'app-health-filter-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  template: `
    <div class="filter-bar">
      <!-- Filter Label -->
      <div class="filter-label-section">
        <span class="main-filter-label">{{ filterLabel }}</span>
      </div>
      
      <!-- Date range filter -->
      <button class="filter-item date-filter" [matMenuTriggerFor]="dateMenu">
        <mat-icon class="filter-icon">calendar_today</mat-icon>
        <span class="filter-label">Date:</span>
        <span class="filter-value">{{ selectedDateRange }}</span>
        <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
      </button>
      <mat-menu #dateMenu="matMenu" class="filter-menu">
        <button mat-menu-item *ngFor="let option of dateRangeOptions" 
                (click)="selectDateRange(option)">
          {{ option.label }}
        </button>
      </mat-menu>
      
      <div class="divider"></div>
      
      <!-- Tenant filter -->
      <button class="filter-item tenant-filter" [matMenuTriggerFor]="tenantMenu" 
              [disabled]="!tenants || tenants.length === 0">
        <mat-icon class="filter-icon">business</mat-icon>
        <span class="filter-label">Tenant:</span>
        <span class="filter-value">{{ selectedTenantName || 'Select Tenant' }}</span>
        <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
      </button>
      <mat-menu #tenantMenu="matMenu" class="filter-menu">
        <button mat-menu-item *ngIf="showAllTenantsOption" 
                (click)="selectTenant(null)"
                [class.selected-item]="selectedTenantName === 'All Tenants'">
          <mat-icon class="menu-icon">view_module</mat-icon>
          All Tenants
        </button>
        <button mat-menu-item *ngFor="let tenant of tenants" 
                (click)="selectTenant(tenant)"
                [class.selected-item]="selectedTenantName === tenant.name">
          <mat-icon class="menu-icon">{{ getMenuIcon(tenant.name) }}</mat-icon>
          {{ tenant.name }}
        </button>
      </mat-menu>
      
      <!-- Use Case filter -->
      <button class="filter-item usecase-filter" [matMenuTriggerFor]="useCaseMenu"
              [disabled]="!useCases || useCases.length === 0">
        <mat-icon class="filter-icon">category</mat-icon>
        <span class="filter-label">Use Case:</span>
        <span class="filter-value">{{ selectedUseCaseName || 'All' }}</span>
        <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
      </button>
      <mat-menu #useCaseMenu="matMenu" class="filter-menu">
        <button mat-menu-item (click)="selectUseCase(null)"
                [class.selected-item]="!selectedUseCaseName || selectedUseCaseName === 'All'">
          <mat-icon class="menu-icon">view_module</mat-icon>
          All
        </button>
        <button mat-menu-item *ngFor="let useCase of useCases" 
                (click)="selectUseCase(useCase)"
                [class.selected-item]="selectedUseCaseName === useCase.name">
          <mat-icon class="menu-icon">{{ getUseCaseIcon(useCase.name) }}</mat-icon>
          {{ useCase.name }}
        </button>
      </mat-menu>
      
      <div class="spacer"></div>
      
      <!-- Refresh button -->
      <button class="refresh-button" (click)="refresh()" [disabled]="isRefreshing" 
              matTooltip="Refresh data">
        <mat-icon [class.rotating]="isRefreshing">refresh</mat-icon>
      </button>
      
      <!-- Help button -->
      <button class="help-button" (click)="toggleHelp()" matTooltip="Help">
        <mat-icon>help_outline</mat-icon>
      </button>
    </div>
    
    <!-- Help tooltip -->
    <div class="help-tooltip" *ngIf="showHelp">
      <div class="tooltip-content">
        <div class="tooltip-header">
          <h3>Health Dashboard Help</h3>
          <button class="close-tooltip" (click)="toggleHelp()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="help-content">
          <div class="help-section">
            <h4><mat-icon>business</mat-icon> Tenants</h4>
            <p>Select from different business units:</p>
            <ul>
              <li><strong>Recoveries</strong> - Debt recovery operations</li>
              <li><strong>Card</strong> - Credit card services</li>
              <li><strong>COAF</strong> - Customer operations and fulfillment</li>
              <li><strong>Secured Card</strong> - Secured credit card services</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h4><mat-icon>category</mat-icon> Use Cases</h4>
            <p>Filter by transaction type:</p>
            <ul>
              <li><strong>All</strong> - View all transaction types</li>
              <li><strong>One time</strong> - Single transactions</li>
              <li><strong>Recurring</strong> - Scheduled recurring payments</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h4><mat-icon>calendar_today</mat-icon> Date Range</h4>
            <p>Filter data by time period to analyze trends and patterns.</p>
          </div>
        </div>
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
    
    .filter-label-section {
      margin-right: 16px;
      
      .main-filter-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-color);
        white-space: nowrap;
      }
    }
    
    .filter-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      background: #fafafa;
      color: var(--text-color);
      font-size: 14px;
      margin-right: 12px;
      transition: all 0.2s ease;
      
      &:hover:not([disabled]) {
        background-color: #f0f0f0;
        border-color: var(--primary-color);
      }
      
      &[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: #f5f5f5;
      }
      
      .filter-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        margin-right: 6px;
        color: var(--primary-color);
      }
      
      .filter-label {
        font-weight: 500;
        margin-right: 4px;
        color: var(--text-secondary);
      }
      
      .filter-value {
        font-weight: 500;
        margin-right: 4px;
        color: var(--text-color);
      }
      
      .dropdown-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--text-secondary);
      }
    }
    
    .divider {
      width: 1px;
      height: 32px;
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
      margin-left: 8px;
      
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
    
    /* Menu styling */
    :host ::ng-deep .filter-menu {
      .mat-mdc-menu-content {
        padding: 8px 0;
      }
      
      .mat-mdc-menu-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        padding: 8px 16px;
        
        .menu-icon {
          margin-right: 12px;
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: var(--primary-color);
        }
        
        &.selected-item {
          background-color: rgba(95, 75, 139, 0.1);
          color: var(--primary-color);
          font-weight: 500;
        }
      }
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
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      width: 500px;
      max-width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #e0e0e0;
      
      h3 {
        margin: 0;
        font-size: 20px;
        color: var(--primary-color);
        display: flex;
        align-items: center;
      }
      
      .close-tooltip {
        border: none;
        background: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          color: var(--text-color);
        }
      }
    }
    
    .help-content {
      padding: 16px 24px 24px;
    }
    
    .help-section {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: var(--primary-color);
        display: flex;
        align-items: center;
        
        mat-icon {
          margin-right: 8px;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
      
      p {
        margin: 0 0 8px 0;
        color: var(--text-color);
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 6px;
          color: var(--text-secondary);
          
          strong {
            color: var(--text-color);
          }
        }
      }
    }
  `]
})
export class HealthFilterBarComponent {
  @Input() filterLabel: string = 'Health Report For :';
  @Input() selectedDateRange: string = 'Last 7 days';
  @Input() selectedTenantName: string = '';
  @Input() selectedUseCaseName: string = '';
  @Input() tenants: Tenant[] = [];
  @Input() useCases: UseCase[] = [];
  @Input() isRefreshing: boolean = false;
  @Input() showAllTenantsOption: boolean = true;

  @Output() dateRangeChanged = new EventEmitter<DateRangeOption>();
  @Output() tenantChanged = new EventEmitter<Tenant | null>();
  @Output() useCaseChanged = new EventEmitter<UseCase | null>();
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

  selectTenant(tenant: Tenant | null): void {
    if (tenant === null) {
      this.selectedTenantName = this.showAllTenantsOption ? 'All Tenants' : '';
      this.tenantChanged.emit(null);
    } else {
      this.selectedTenantName = tenant.name;
      this.tenantChanged.emit(tenant);
    }
  }

  selectUseCase(useCase: UseCase | null): void {
    if (useCase === null) {
      this.selectedUseCaseName = 'All';
      this.useCaseChanged.emit(null);
    } else {
      this.selectedUseCaseName = useCase.name;
      this.useCaseChanged.emit(useCase);
    }
  }

  refresh(): void {
    this.refreshClicked.emit();
  }

  toggleHelp(): void {
    this.showHelp = !this.showHelp;
    this.helpClicked.emit();
  }

  getMenuIcon(tenantName: string): string {
    const iconMap: { [key: string]: string } = {
      'Recoveries': 'assignment_return',
      'Card': 'credit_card',
      'COAF': 'support_agent',
      'Secured Card': 'security'
    };
    return iconMap[tenantName] || 'business';
  }

  getUseCaseIcon(useCaseName: string): string {
    const iconMap: { [key: string]: string } = {
      'All': 'view_module',
      'One time': 'payment',
      'Recurring': 'repeat'
    };
    return iconMap[useCaseName] || 'category';
  }
}