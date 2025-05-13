import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-case-dashboard',
  standalone: false, // Change to false since we're using NgModule for this component
  templateUrl: './test-case-dashboard.component.html',
  styleUrls: ['./test-case-dashboard.component.scss']
})
export class TestCaseDashboardComponent {
  // Component logic here
}