// src/app/features/dashboard/health/health-dashboard/health-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDataService, Tenant, UseCase } from '../../../../core/services/tenant-data.service';
import { GooglePieChartComponent } from '../../../../shared/components/charts/google-pie-chart/google-pie-chart.component';
import { HealthFilterBarComponent } from '../../../../shared/components/filters/health-filter-bar/health-filter-bar.component';
import { BddScenarioDetailsComponent } from '../../../../shared/components/bdd/bdd-scenario-details/bdd-scenario-details.component';
import { BddDataService } from '../../../../core/services/bdd-data.service';
import { BddScenario, BddFilters, BddSummary } from '../../../../core/models/bdd-models';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface TenantSummary {
  id: string;
  name: string;
  overall: number;
  oneTime: {
    overall: number;
    accounts: { type: string; percentage: number; }[];
  };
  recurring: {
    overall: number;
    accounts: { type: string; percentage: number; }[];
  };
}

@Component({
  selector: 'app-health-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    GooglePieChartComponent,
    HealthFilterBarComponent,
    BddScenarioDetailsComponent
  ],
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit {
  // Filter state for SUMMARY
  summarySelectedDateRange: string = 'Last 7 days';
  summarySelectedTenant: Tenant | null = null; // null means "All Tenants"
  summarySelectedUseCase: UseCase | null = null; // null means "All"

  // Filter state for CHARTS
  chartsSelectedDateRange: string = 'Last 7 days';
  chartsSelectedTenant: Tenant | null = null;
  chartsSelectedUseCase: UseCase | null = null;

  // Filter state for BDD SCENARIOS
  bddSelectedDateRange: string = 'Last 7 days';
  bddSelectedTenant: Tenant | null = null;
  bddSelectedUseCase: UseCase | null = null;
  bddSelectedAccountType: string = 'All';

  // Available tenants, use cases, and account types
  availableTenants: Tenant[] = [];
  availableUseCases: UseCase[] = [];
  availableAccountTypes: string[] = ['ACH', 'Debit'];

  // Loading and error states
  isLoading = true;
  isRefreshing = false;
  hasError = false;
  errorMessage = '';

  // Account charts data grouped by use case
  accountChartGroups: any[] = [];

  // Tenant summary data for overview cards
  tenantSummaryData: TenantSummary[] = [];

  // BDD Scenarios data
  bddScenarios: BddScenario[] = [];
  bddSummary: BddSummary | null = null;
  bddLoading = false;

  constructor(
    private tenantDataService: TenantDataService,
    private bddDataService: BddDataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTenants();
  }

  private loadTenants(): void {
    this.tenantDataService.getTenants().subscribe({
      next: (tenants) => {
        this.availableTenants = tenants;

        // Set default to Recoveries tenant and All use case for CHARTS only
        const defaultTenant = tenants.find(t => t.id === 'recoveries') || tenants[0];
        if (defaultTenant) {
          // Set for charts only
          this.chartsSelectedTenant = defaultTenant;
          this.availableUseCases = defaultTenant.useCases;
          const defaultUseCase = defaultTenant.useCases.find(uc => uc.id === 'all') || defaultTenant.useCases[0];
          this.chartsSelectedUseCase = defaultUseCase;

          // BDD filters - start with same defaults as charts
          this.bddSelectedTenant = defaultTenant;
          this.bddSelectedUseCase = defaultUseCase;
          this.bddSelectedAccountType = 'ACH'; // Default to ACH

          // SUMMARY starts with "All" for both tenant and use case (already set above)
          // Set available use cases to all possible use cases from all tenants
          this.setAllAvailableUseCases();

          // Load data after setting defaults
          this.loadHealthData();
        }
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.showErrorSnackbar('Failed to load tenants.');
        this.isLoading = false;
      }
    });
  }

  private setAllAvailableUseCases(): void {
    // Collect all unique use cases from all tenants
    const allUseCases = new Map<string, UseCase>();

    this.availableTenants.forEach(tenant => {
      tenant.useCases.forEach(useCase => {
        if (!allUseCases.has(useCase.id)) {
          allUseCases.set(useCase.id, useCase);
        }
      });
    });

    this.availableUseCases = Array.from(allUseCases.values());
  }

  public loadHealthData(forceRefresh: boolean = false): void {
    this.resetErrors();

    if (forceRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }

    // Load summary data (all tenants or filtered)
    this.loadSummaryData(forceRefresh);

    // Load charts data based on charts filters
    this.loadChartsData(forceRefresh);
  }

  private loadSummaryData(forceRefresh: boolean = false): void {
    // If no tenant selected in summary filter, load all tenants
    if (!this.summarySelectedTenant) {
      this.loadAllTenantsSummary(forceRefresh);
    } else {
      this.loadSingleTenantSummary(forceRefresh);
    }
  }

  private loadAllTenantsSummary(forceRefresh: boolean = false): void {
    const tenantPromises = this.availableTenants.map(tenant =>
      this.tenantDataService.getTenantHealthData(tenant.id, 'all', forceRefresh).toPromise()
    );

    Promise.all(tenantPromises).then(results => {
      this.tenantSummaryData = this.availableTenants.map((tenant, index) => {
        const data = results[index];
        return this.formatTenantSummary(tenant, data);
      });

      if (forceRefresh) {
        this.isRefreshing = false;
      } else {
        this.isLoading = false;
      }
    }).catch(error => {
      this.handleError('Failed to load tenant summary data.', error);
    });
  }

  private loadSingleTenantSummary(forceRefresh: boolean = false): void {
    if (!this.summarySelectedTenant) return;

    // If no use case is selected, use 'all' as default
    const useCaseId = this.summarySelectedUseCase?.id || 'all';

    this.tenantDataService.getTenantHealthData(
      this.summarySelectedTenant.id,
      useCaseId,
      forceRefresh
    ).subscribe({
      next: (data) => {
        this.tenantSummaryData = [this.formatTenantSummary(this.summarySelectedTenant!, data)];
      },
      error: (error) => {
        this.handleError('Failed to load summary data.', error);
      },
      complete: () => {
        if (forceRefresh) {
          this.isRefreshing = false;
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  private formatTenantSummary(tenant: Tenant, data: any): TenantSummary {
    const accounts = data.accounts || {};

    // Calculate overall pass rate
    const allAccounts = Object.values(accounts) as any[];
    const totalPassed = allAccounts.reduce((sum: number, acc: any) => sum + acc.passed, 0);
    const totalAll = allAccounts.reduce((sum: number, acc: any) => sum + acc.total, 0);
    const overall = totalAll > 0 ? Math.round((totalPassed / totalAll) * 100) : 0;

    // Format one-time accounts
    const oneTimeAccounts = [
      accounts['one-time-ach'] ? { type: 'ACH', percentage: Math.round(parseFloat(accounts['one-time-ach'].successRate)) } : null,
      accounts['one-time-debit'] ? { type: 'Debit', percentage: Math.round(parseFloat(accounts['one-time-debit'].successRate)) } : null
    ].filter(Boolean) as { type: string; percentage: number; }[];

    const oneTimeTotal = oneTimeAccounts.reduce((sum, acc) => sum + acc.percentage, 0);
    const oneTimeOverall = oneTimeAccounts.length > 0 ? Math.round(oneTimeTotal / oneTimeAccounts.length) : 0;

    // Format recurring accounts
    const recurringAccounts = [
      accounts['recurring-ach'] ? { type: 'ACH', percentage: Math.round(parseFloat(accounts['recurring-ach'].successRate)) } : null
    ].filter(Boolean) as { type: string; percentage: number; }[];

    const recurringOverall = recurringAccounts.length > 0 ? recurringAccounts[0].percentage : 0;

    return {
      id: tenant.id,
      name: tenant.name,
      overall,
      oneTime: {
        overall: oneTimeOverall,
        accounts: oneTimeAccounts
      },
      recurring: {
        overall: recurringOverall,
        accounts: recurringAccounts
      }
    };
  }

  private loadChartsData(forceRefresh: boolean = false): void {
    if (!this.chartsSelectedTenant) return;

    this.tenantDataService.getTenantHealthData(
      this.chartsSelectedTenant.id,
      this.chartsSelectedUseCase?.id,
      forceRefresh
    ).subscribe({
      next: (data) => {
        this.prepareAccountChartGroups(data.accounts);
        // Load BDD data when charts data loads (if BDD filters are set)
        if (this.bddSelectedTenant) {
          this.loadBddData(forceRefresh);
        }
      },
      error: (error) => {
        this.handleError('Failed to load charts data.', error);
      }
    });
  }

  private loadBddData(forceRefresh: boolean = false): void {
    if (!this.bddSelectedTenant) return;

    this.bddLoading = true;

    const filters: BddFilters = {
      tenantId: this.bddSelectedTenant.id,
      useCaseId: this.bddSelectedUseCase?.id,
      accountType: this.bddSelectedAccountType === 'All' ? undefined : this.bddSelectedAccountType,
      dateRange: this.bddSelectedDateRange
    };

    // Load BDD scenarios
    this.bddDataService.getBddScenarios(filters, forceRefresh).subscribe({
      next: (scenarios) => {
        this.bddScenarios = scenarios;
      },
      error: (error) => {
        this.handleError('Failed to load BDD scenarios.', error);
      },
      complete: () => {
        this.bddLoading = false;
      }
    });

    // Load BDD summary
    this.bddDataService.getBddSummary(filters, forceRefresh).subscribe({
      next: (summary) => {
        this.bddSummary = summary;
      },
      error: (error) => {
        this.handleError('Failed to load BDD summary.', error);
      }
    });
  }

  // Handle tenant card clicks
  onTenantCardClick(tenant: TenantSummary): void {
    // Auto-select in charts filter
    const tenantObj = this.availableTenants.find(t => t.id === tenant.id);
    if (tenantObj) {
      this.chartsSelectedTenant = tenantObj;
      this.availableUseCases = tenantObj.useCases;
      this.chartsSelectedUseCase = tenantObj.useCases.find(uc => uc.id === 'all') || tenantObj.useCases[0];
      this.loadChartsData();
    }
  }

  // Get score color class
  getScoreClass(score: number): string {
    if (score >= 80) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  }

  // Track by function for tenant cards
  trackByTenantId(index: number, tenant: TenantSummary): string {
    return tenant.id;
  }

  // Handler for SUMMARY filter-bar events
  onSummaryDateRangeChanged(option: any): void {
    this.summarySelectedDateRange = option.label;
    this.loadSummaryData();
  }

  onSummaryTenantChanged(tenant: Tenant | null): void {
    this.summarySelectedTenant = tenant;

    if (tenant) {
      // When a specific tenant is selected, show only its use cases
      this.availableUseCases = tenant.useCases;
      this.summarySelectedUseCase = null; // Reset to "All" for this tenant
    } else {
      // When "All Tenants" is selected, show all possible use cases
      this.setAllAvailableUseCases();
      this.summarySelectedUseCase = null; // Reset to "All Use Cases"
    }

    this.loadSummaryData();
  }

  onSummaryUseCaseChanged(useCase: UseCase | null): void {
    this.summarySelectedUseCase = useCase;
    this.loadSummaryData();
  }

  onSummaryRefreshClicked(): void {
    this.loadSummaryData(true);
    this.showInfoSnackbar('Summary data refreshed.');
  }

  onSummaryHelpClicked(): void {
    // This is handled by the filter bar component itself
  }

  // Handler for CHARTS filter-bar events
  onChartsDateRangeChanged(option: any): void {
    this.chartsSelectedDateRange = option.label;
    this.loadChartsData();
  }

  onChartsTenantChanged(tenant: Tenant | null): void {
    if (tenant) {
      this.chartsSelectedTenant = tenant;
      this.availableUseCases = tenant.useCases;
      this.chartsSelectedUseCase = null;
      this.loadChartsData();
    }
    // If null is passed (shouldn't happen for charts), ignore it
  }

  onChartsUseCaseChanged(useCase: UseCase | null): void {
    this.chartsSelectedUseCase = useCase;
    this.loadChartsData();
  }

  onChartsRefreshClicked(): void {
    this.loadChartsData(true);
    this.showInfoSnackbar('Charts data refreshed.');
  }

  onChartsHelpClicked(): void {
    // This is handled by the filter bar component itself
  }

  // Handler for BDD filter-bar events
  onBddDateRangeChanged(option: any): void {
    this.bddSelectedDateRange = option.label;
    this.loadBddData();
  }

  onBddTenantChanged(tenant: Tenant | null): void {
    if (tenant) {
      this.bddSelectedTenant = tenant;
      this.bddSelectedUseCase = null; // Reset use case when tenant changes
      this.availableUseCases = tenant.useCases;
      this.loadBddData();
    }
  }

  onBddUseCaseChanged(useCase: UseCase | null): void {
    this.bddSelectedUseCase = useCase;
    this.loadBddData();
  }

  onBddAccountTypeChanged(accountType: string): void {
    this.bddSelectedAccountType = accountType;
    this.loadBddData();
  }

  onBddRefreshClicked(): void {
    this.loadBddData(true);
    this.showInfoSnackbar('Test scenarios refreshed.');
  }

  onBddHelpClicked(): void {
    // Handle help for BDD section
  }

  // BDD event handlers
  onScenarioRerun(scenario: BddScenario): void {
    console.log('Re-running scenario:', scenario.name);
    this.showInfoSnackbar(`Re-running scenario: ${scenario.name}`);
    // In a real app, this would trigger a test re-run
  }

  onCopyError(scenario: BddScenario): void {
    const failedStep = scenario.steps.find(step => step.status === 'failed');
    if (failedStep) {
      const errorText = `Scenario: ${scenario.name}\nStep: ${failedStep.text}\nError: ${failedStep.errorMessage}`;
      navigator.clipboard.writeText(errorText);
      this.showInfoSnackbar('Error details copied to clipboard');
    }
  }

  onViewScreenshots(scenario: BddScenario): void {
    console.log('Viewing screenshots for scenario:', scenario.name);
    this.showInfoSnackbar(`Screenshots for: ${scenario.name}`);
    // In a real app, this would open a screenshots viewer
  }

  // Rest of existing methods...
  private prepareAccountChartGroups(accountsData: any): void {
    this.accountChartGroups = [];

    const groupedData: { [key: string]: any[] } = {};

    Object.keys(accountsData).forEach(accountKey => {
      const accountData = accountsData[accountKey];
      const useCase = accountData.useCase;

      if (!groupedData[useCase]) {
        groupedData[useCase] = [];
      }

      const chartData = {
        title: this.formatAccountTitle(accountData.accountType),
        data: [
          accountData.passed,
          accountData.failed,
          accountData.error,
          accountData.cancelled
        ],
        labels: ['Passed', 'Failed', 'Error', 'Cancelled'],
        colors: [
          '#4CAF50',
          '#F44336',
          '#FF9800',
          '#9E9E9E'
        ],
        successRate: accountData.successRate,
        accountType: accountData.accountType,
        useCase: accountData.useCase
      };

      groupedData[useCase].push(chartData);
    });

    Object.keys(groupedData).forEach(useCase => {
      this.accountChartGroups.push({
        useCaseTitle: this.formatUseCaseTitle(useCase),
        useCase: useCase,
        charts: groupedData[useCase]
      });
    });

    this.accountChartGroups.sort((a, b) => {
      const order = ['one-time', 'recurring', 'all'];
      return order.indexOf(a.useCase) - order.indexOf(b.useCase);
    });
  }

  private formatUseCaseTitle(useCase: string): string {
    switch (useCase) {
      case 'one-time':
        return 'One Time';
      case 'recurring':
        return 'Recurring';
      case 'all':
        return 'All Use Cases';
      default:
        return useCase.charAt(0).toUpperCase() + useCase.slice(1);
    }
  }

  private formatAccountTitle(accountType: string): string {
    return accountType.toUpperCase();
  }

  trackByChartTitle(index: number, chart: any): string {
    return chart.title;
  }

  trackByGroupTitle(index: number, group: any): string {
    return group.useCaseTitle;
  }

  getSharedLegendLabels(): string[] {
    return ['Passed', 'Failed', 'Error', 'Cancelled'];
  }

  getSharedLegendColors(): string[] {
    return [
      '#4CAF50',
      '#F44336',
      '#FF9800',
      '#9E9E9E'
    ];
  }

  onExportData(): void {
    console.log('Exporting health data...');
    this.showInfoSnackbar('Data export initiated.');
  }

  onOpenSettings(): void {
    console.log('Opening settings...');
    this.showInfoSnackbar('Settings opened.');
  }

  onToggleFullScreen(): void {
    console.log('Toggling full screen...');
    this.showInfoSnackbar('Full screen toggled.');
  }

  private resetErrors(): void {
    this.hasError = false;
    this.errorMessage = '';
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.hasError = true;
    this.errorMessage = message;
    this.showErrorSnackbar(message);
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfoSnackbar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000
    });
  }

  // Track by functions for templates
  trackByScenarioId(index: number, scenario: BddScenario): string {
    return scenario.id;
  }

  trackByStepId(index: number, step: any): string {
    return step.id;
  }
}