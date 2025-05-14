// src/app/shared/components/tables/data-table/data-table.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  // Add these styles to match the Eggplant DAI style in the reference images
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    :host ::ng-deep .mat-mdc-table {
      background-color: #FFFFFF !important;
      width: 100%;
      border-collapse: collapse;
      box-shadow: none !important;
    }
    
    :host ::ng-deep .mat-mdc-header-row {
      background-color: #F7F7F7 !important;
      border-bottom: 1px solid #E0E0E0;
      height: 48px !important;
    }
    
    :host ::ng-deep .mat-mdc-header-cell {
      color: #333333 !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      padding: 0 16px !important;
      text-align: left;
    }
    
    :host ::ng-deep .mat-mdc-cell {
      color: #333333 !important;
      font-size: 14px !important;
      padding: 0 16px !important;
      border-bottom: 1px solid #F0F0F0 !important;
      height: 48px !important;
    }
    
    :host ::ng-deep .mat-mdc-row {
      height: 48px !important;
      background-color: #FFFFFF !important;
    }
    
    :host ::ng-deep .mat-mdc-row:hover {
      background-color: #F5F5F5 !important;
    }
    
    :host ::ng-deep .error-cell {
      color: #F44336 !important;
      font-weight: 500 !important;
    }
    
    :host ::ng-deep .warning-cell {
      color: #FF9800 !important;
      font-weight: 500 !important;
    }
    
    :host ::ng-deep .mat-icon-button {
      color: #757575 !important;
    }
    
    :host ::ng-deep .mat-paginator {
      background-color: transparent !important;
    }
    
    /* Empty state styling */
    :host ::ng-deep .empty-row {
      padding: 16px !important;
      text-align: center;
      color: #757575 !important;
    }
    
    /* Loading state styling */
    :host ::ng-deep .loading-message {
      color: #757575 !important;
    }
    
    /* Additional style to match the Eggplant DAI tables */
    :host ::ng-deep .mat-column-id {
      width: 100px;
    }
    
    :host ::ng-deep .clickable-row {
      cursor: pointer;
    }
  `]
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() title: string = '';
  @Input() showPaginator: boolean = false;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() sortable: boolean = true;
  @Input() loading: boolean = false;
  @Input() maxHeight: string = 'auto';

  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() actionClick = new EventEmitter<{row: any, action: string}>();

  displayedColumns: string[] = [];
  hasActions = false;

  ngOnInit() {
    this.displayedColumns = this.columns.map(col => col.property);
    
    // Pre-check if we have actions to avoid template assignment
    this.hasActions = this.columns.some(col => !!col.actions && col.actions.length > 0);
    if (this.hasActions) {
      this.displayedColumns.push('actions');
    }
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  onSort(sortEvent: Sort) {
    this.sortChange.emit(sortEvent);
  }

  onPage(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent);
  }

  onActionClick(row: any, action: string) {
    this.actionClick.emit({row, action});
  }

  // Helper methods for the template
  getActions(row: any): any[] {
    const actionsColumn = this.columns.find(col => !!col.actions);
    return actionsColumn && actionsColumn.actions ? actionsColumn.actions : [];
  }

  getFormattedValue(row: any, column: any): string {
    if (column.formatter) {
      return column.formatter(row[column.property], row);
    }
    return row[column.property];
  }

  // Helper to check if a column is sortable
  isSortable(column: any): boolean {
    return this.sortable && column.sortable !== false;
  }
}