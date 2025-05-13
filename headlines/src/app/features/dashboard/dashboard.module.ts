import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCaseDashboardComponent } from './test-case/test-case-dashboard/test-case-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    TestCaseDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }