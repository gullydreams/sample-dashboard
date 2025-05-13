// src/app/features/dashboard/dashboard-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCaseDashboardComponent } from './test-case/test-case-dashboard/test-case-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'test-case',
    pathMatch: 'full'
  },
  {
    path: 'test-case',
    component: TestCaseDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }