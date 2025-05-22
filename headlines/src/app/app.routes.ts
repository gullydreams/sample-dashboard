// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TestCaseDashboardComponent } from './features/dashboard/test-case/test-case-dashboard/test-case-dashboard.component';
import { ModelDashboardComponent } from './features/dashboard/model/model-dashboard/model-dashboard.component';
import { ExploratoryDashboardComponent } from './features/dashboard/exploratory/exploratory-dashboard/exploratory-dashboard.component';
import { HealthDashboardComponent } from './features/dashboard/health/health-dashboard/health-dashboard.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        redirectTo: 'test-case',
        pathMatch: 'full'
      },
      {
        path: 'test-case',
        component: TestCaseDashboardComponent
      },
      {
        path: 'model',
        component: ModelDashboardComponent
      },
      {
        path: 'exploratory',
        component: ExploratoryDashboardComponent
      },
      {
        path: 'health',
        component: HealthDashboardComponent
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];