// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { MetricCardComponent } from './components/cards/metric-card/metric-card.component';
import { DonutChartComponent } from './components/charts/donut-chart/donut-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { DataTableComponent } from './components/tables/data-table/data-table.component';
import { GooglePieChartComponent } from './components/charts/google-pie-chart/google-pie-chart.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonModule,
    // Standalone components
    MetricCardComponent,
    DonutChartComponent,
    LineChartComponent,
    DataTableComponent,
    GooglePieChartComponent
  ],
  exports: [
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonModule,
    // Standalone components
    MetricCardComponent,
    DonutChartComponent,
    LineChartComponent,
    DataTableComponent,
    GooglePieChartComponent
  ]
})
export class SharedModule { }