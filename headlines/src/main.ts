// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

// Set default colors and styling for all charts
Chart.defaults.color = '#333333';
Chart.defaults.font.family = "'Roboto', sans-serif";
Chart.defaults.borderColor = 'rgba(0,0,0,0.1)';

// Fix for black label issue in legends
Chart.defaults.plugins.legend.labels.color = '#333333';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));