// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TestCaseDashboardComponent } from './features/dashboard/test-case/test-case-dashboard/test-case-dashboard.component';

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
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];