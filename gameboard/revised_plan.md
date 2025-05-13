Complete Project Plan: "Headlines" - Eggplant DAI Dashboard POC


1. Project Setup & Initial Commands
   bash# Install Angular CLI globally if not already installed
   npm install -g @angular/cli

# Create new Angular project

ng new headlines --routing --style=scss

# Navigate to project directory

cd headlines

# Install required dependencies

npm install @angular/material @angular/cdk ng2-charts chart.js

# Add Angular Material

ng add @angular/material

# Generate core modules

ng generate module core
ng generate module shared

# Generate feature modules with routing

ng generate module features/dashboard --routing

# Start the development server

ng serve
2\. Project Structure
headlines/
├── src/
│   ├── app/
│   │   ├── core/                  # Core services, guards
│   │   │   ├── services/
│   │   │   │   ├── test-data.service.ts
│   │   │   │   ├── model-data.service.ts
│   │   │   │   └── filter.service.ts
│   │   │   └── core.module.ts
│   │   ├── shared/                # Shared components
│   │   │   ├── components/
│   │   │   │   ├── charts/
│   │   │   │   │   ├── donut-chart/
│   │   │   │   │   ├── line-chart/
│   │   │   │   │   └── bar-chart/
│   │   │   │   ├── tables/
│   │   │   │   │   └── data-table/
│   │   │   │   ├── cards/
│   │   │   │   │   └── metric-card/
│   │   │   │   └── filters/
│   │   │   │       └── date-filter/
│   │   │   └── shared.module.ts
│   │   ├── layouts/
│   │   │   ├── main-layout/
│   │   │   ├── sidebar/
│   │   │   └── header/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   ├── test-case/     # Test Case Dashboard
│   │   │   │   ├── model/         # Model Dashboard
│   │   │   │   ├── exploratory/   # Exploratory Dashboard
│   │   │   │   ├── dashboard-routing.module.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   └── ...
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.png
│   │   ├── mock-data/             # JSON files for mock data
│   │   │   ├── test-cases.json
│   │   │   ├── model-data.json
│   │   │   └── ...
│   │   └── ...
│   ├── styles/
│   │   ├── _variables.scss        # Design system variables
│   │   ├── _grid-layouts.scss     # Grid layout patterns
│   │   ├── _flex-layouts.scss     # Flexbox utility classes
│   │   ├── _responsive.scss       # Media queries and breakpoints
│   │   └── _charts.scss           # Chart styling
│   ├── environments/
│   └── index.html
└── ...
3\. Quantifiable Metrics for Progress Tracking
Total UI Components (35 total)
Core Components (7)

Sidebar Navigation
Header Bar with Model Selector
Dashboard Container Layout
Filter Bar (Date Range Selector)
Model/Suite Selector
Help/Info Button Component
Page Footer

Reusable Chart Components (8)

Donut Chart Component
Line Chart Component
Bar Chart Component
Summary Statistic Card
Data Table Component
Status Indicator (pass/fail/error icons)
Progress Bar Component
"View All" Action Button

Test Case Dashboard Components (7)

Test Case Run Summary Bar
Test Case Runs Per Day Chart
Test Case Results By Status Chart
Top 10 Longest Running Test Cases Table
Top 10 Test Case Failures Table
Top 10 Test Case Errors Table
Filter Controls for Test Case Dashboard

Model Dashboard Components (7)

Test Results Record Chart
All Runs (Exploratory/Directed) Chart
Test Case Completion Chart
Failure Type Chart
Coverage Chart
Test Breakdown Chart
Date Range Controls for Model Dashboard

Exploratory Dashboard Components (6)

Model Chart
Bug Hunting Chart
Coverage Chart
Test Cases Chart
Test Results Chart
Model Selector for Exploratory Dashboard

Routes Implementation (5 total)

Main Dashboard Route
Test Case Dashboard Route
Model Dashboard Route
Exploratory Dashboard Route
Dashboard Navigation

Mock Data Services (5 total)

Test Results Data Service
Model Information Service
Test Case Data Service
Coverage Data Service
Filter State Service

Features and Functionalities (15 total)

Dashboard Navigation
Date Range Filtering
Model/Suite Selection
Chart Interactions (hover states)
Data Tables with Sorting
"View All" Functionality
Status Filtering
Chart Legend Toggles
Responsive Layout Adaptation
Data Refreshing
Chart Animation
Loading States
Error Handling
Theme Application
Help Tooltips


4. Development Phases & Milestones
   Phase 1: Project Setup (10%) - Days 1-2

Initialize Angular project
Set up project structure
Configure Angular Material theme
Create mock data JSON files
Set up basic routing

bash# Commands for Phase 1
ng new headlines --routing --style=scss
cd headlines
npm install @angular/material @angular/cdk ng2-charts chart.js
ng add @angular/material

# Generate core modules and components

Phase 2: Core & Shared Components (20%) - Days 3-5

Implement layout components
Create reusable chart components
Build shared UI elements
Implement core services

bash# Commands for Phase 2
ng generate component layouts/main-layout
ng generate component layouts/sidebar
ng generate component layouts/header
ng generate component shared/components/charts/donut-chart

# Additional component generation commands

Phase 3: Test Case Dashboard (25%) - Days 6-8

Implement Test Case run summary bar
Create Test Case runs per day chart
Build Test Case results by status chart
Implement Top 10 tables
Set up filtering functionality

bash# Commands for Phase 3
ng generate component features/dashboard/test-case/test-case-dashboard
ng generate component features/dashboard/test-case/components/run-summary

# Additional component generation commands

Phase 4: Model Dashboard (20%) - Days 9-11

Implement Test Results Record chart
Create All Runs chart
Build Test Case Completion chart
Implement Failure Type and Coverage charts
Set up date range functionality

bash# Commands for Phase 4
ng generate component features/dashboard/model/model-dashboard
ng generate component features/dashboard/model/components/test-results-record

# Additional component generation commands

Phase 5: Exploratory Dashboard (15%) - Days 12-13

Implement Model chart
Create Bug Hunting chart
Build Coverage charts
Implement Test Cases and Test Results charts
Set up model selector

bash# Commands for Phase 5
ng generate component features/dashboard/exploratory/exploratory-dashboard
ng generate component features/dashboard/exploratory/components/bug-hunting

# Additional component generation commands

Phase 6: Polish & Integration (10%) - Days 14-15

Implement responsive designs
Add animations and transitions
Connect all dashboards
Implement help tooltips
Add final styling touches

bash# Commands for Phase 6

# No specific generation commands, mostly refining existing code


5. Implementation Strategies
   Layout Implementation Using CSS Grid & Flexbox
   html<!-- Example dashboard layout -->
   <div class="dashboard-container">
   <div class="filter-bar">
   <!-- Date filters, model selectors, etc. -->
   </div>

<div class="dashboard-grid">
<div class="grid-item grid-item--large">
<!-- Test case runs per day (larger chart) -->
</div>

```
<div class="grid-item">
  <!-- Test status donut chart -->
</div>

<div class="grid-item">
  <!-- Coverage chart -->
</div>

<div class="grid-item grid-item--full">
  <!-- Data tables for longest running tests -->
</div>
```

</div>
</div>
scss// _grid-layouts.scss
.dashboard-grid {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;

.grid-item {
background: #fff;
border-radius: 8px;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
padding: 16px;

```
&--large {
  grid-column: span 2;
}

&--full {
  grid-column: 1 / -1;
}
```

}
}

// Responsive adjustments
@media (max-width: 992px) {
.dashboard-grid {
grid-template-columns: repeat(2, 1fr);
}
}

@media (max-width: 768px) {
.dashboard-grid {
grid-template-columns: 1fr;

```
.grid-item--large {
  grid-column: auto;
}
```

}
}
Mock Data Service Example
typescript// test-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
providedIn: 'root'
})
export class TestDataService {
constructor(private http: HttpClient) {}

getTestCaseResults(filters?: any): Observable<any\[\]> {
// In a real app, this would be an API call
return this.http.get<any\[\]>('assets/mock-data/test-cases.json').pipe(
delay(500), // Simulate network delay
map(data => this.applyFilters(data, filters))
);
}

private applyFilters(data: any\[\], filters?: any): any\[\] {
if (!filters) return data;

```
// Apply filtering logic
return data.filter(item => {
  if (filters.dateFrom && new Date(item.date) < new Date(filters.dateFrom)) {
    return false;
  }
  if (filters.model && item.model !== filters.model) {
    return false;
  }
  return true;
});
```

}
}
Chart Component Example
typescript// donut-chart.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
selector: 'app-donut-chart',
templateUrl: './donut-chart.component.html',
styleUrls: \['./donut-chart.component.scss'\]
})
export class DonutChartComponent implements OnChanges {
@Input() data: any\[\];
@Input() labels: string\[\];
@Input() colors: string\[\];
@Input() title: string;

chart: any;

ngOnChanges() {
if (this.data && this.labels) {
this.createChart();
}
}

createChart() {
if (this.chart) {
this.chart.destroy();
}

```
const ctx = document.getElementById('myChart') as HTMLCanvasElement;
this.chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: this.labels,
    datasets: [{
      data: this.data,
      backgroundColor: this.colors
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: this.title
      }
    }
  }
});
```

}
}
html<!-- donut-chart.component.html -->
<div class="chart-container">
<canvas id="myChart"></canvas>
</div>
6\. Testing Strategy

Unit tests for services and utilities
Component tests for isolated components
No end-to-end tests (as this is a UI demo)

bash# Running tests
ng test
7\. Tracking Progress
Weekly progress report template:
MetricWeek 1Week 2Week 3UI Components0/3515/3535/35Routes0/53/55/5Mock Services0/53/55/5Features0/157/1515/15Development Phases30%70%100%
8\. Deliverables

Working Angular application with three dashboard types
Mock data that demonstrates realistic usage
Responsive design that works on different screen sizes
Clean, modern CSS using Grid and Flexbox layouts
Documentation on how to run and extend the application


9. Additional Resources
   For the Eggplant DAI styling:

Use purple (#5F4B8B) as the primary color
Use green (#4CAF50) for success indicators
Use red (#F44336) for failure indicators
Use orange (#FF9800) for warnings/errors
Use light gray (#F5F5F5) for backgrounds

scss// _variables.scss
\:root {
\--primary-color: #5F4B8B;
\--success-color: #4CAF50;
\--failure-color: #F44336;
\--error-color: #FF9800;
\--warning-color: #FF9800;
\--background-color: #F5F5F5;
\--card-background: #FFFFFF;
\--text-color: #333333;
\--text-secondary: #666666;
\--border-radius: 8px;
\--shadow: 0 2px 5px rgba(0,0,0,0.1);
}
This comprehensive plan provides a clear roadmap for developing the "Headlines" project, with measurable metrics for tracking progress and specific implementation strategies for modern CSS layouts. The Angular application will provide a realistic POC of the Eggplant DAI dashboards without requiring actual backend integration.