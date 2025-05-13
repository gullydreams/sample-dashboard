// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from './components/cards/metric-card/metric-card.component';
import { DonutChartComponent } from './components/charts/donut-chart/donut-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    // If these components are standalone, don't declare them
    // If these components are non-standalone, declare them
  ],
  imports: [
    CommonModule,
    MatIconModule,
    // If these components are standalone, import them
    MetricCardComponent,
    DonutChartComponent,
    LineChartComponent
  ],
  exports: [
    // Export components so they can be used in other modules
    MetricCardComponent,
    DonutChartComponent,
    LineChartComponent,
    MatIconModule
  ]
})
export class SharedModule { }