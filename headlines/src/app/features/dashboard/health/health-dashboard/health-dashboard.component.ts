// src/app/features/dashboard/health/health-dashboard/health-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDataService, Tenant, UseCase } from '../../../../core/services/tenant-data.service';
import { MetricCardComponent } from '../../../../shared/components/cards/metric-card/metric-card.component';
import { GooglePieChartComponent } from '../../../../shared/components/charts/google-pie-chart/google-pie-chart.component';
import { HealthFilterBarComponent } from '../../../../shared/components/filters/health-filter-bar/health-filter-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-health-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatSnackBarModule,
        MetricCardComponent,
        GooglePieChartComponent,
        HealthFilterBarComponent
    ],
    templateUrl: './health-dashboard.component.html',
    styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent implements OnInit {
    // Summary data
    summaryData: any = {};

    // Filter state for SUMMARY
    summarySelectedDateRange: string = 'Last 7 days';
    summarySelectedTenant: Tenant | null = null;
    summarySelectedUseCase: UseCase | null = null;

    // Filter state for CHARTS
    chartsSelectedDateRange: string = 'Last 7 days';
    chartsSelectedTenant: Tenant | null = null;
    chartsSelectedUseCase: UseCase | null = null;

    // Available tenants and use cases
    availableTenants: Tenant[] = [];
    availableUseCases: UseCase[] = [];

    // Loading and error states
    isLoading = true;
    isRefreshing = false;
    hasError = false;
    errorMessage = '';

    // Account charts data grouped by use case
    accountChartGroups: any[] = [];

    constructor(
        private tenantDataService: TenantDataService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadTenants();
    }

    private loadTenants(): void {
        this.tenantDataService.getTenants().subscribe({
            next: (tenants) => {
                this.availableTenants = tenants;
                // Set default to Recoveries tenant and All use case for BOTH filter bars
                const defaultTenant = tenants.find(t => t.id === 'recoveries') || tenants[0];
                if (defaultTenant) {
                    // Set for summary
                    this.summarySelectedTenant = defaultTenant;
                    // Set for charts
                    this.chartsSelectedTenant = defaultTenant;

                    this.availableUseCases = defaultTenant.useCases;
                    // Set default use case to "All" for both
                    const defaultUseCase = defaultTenant.useCases.find(uc => uc.id === 'all') || defaultTenant.useCases[0];
                    this.summarySelectedUseCase = defaultUseCase;
                    this.chartsSelectedUseCase = defaultUseCase;

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

    public loadHealthData(forceRefresh: boolean = false): void {
        this.resetErrors();

        if (forceRefresh) {
            this.isRefreshing = true;
        } else {
            this.isLoading = true;
        }

        // Load summary data based on summary filters
        this.loadSummaryData(forceRefresh);

        // Load charts data based on charts filters
        this.loadChartsData(forceRefresh);
    }

    private loadSummaryData(forceRefresh: boolean = false): void {
        if (!this.summarySelectedTenant) return;

        this.tenantDataService.getTenantHealthData(
            this.summarySelectedTenant.id,
            this.summarySelectedUseCase?.id,
            forceRefresh
        ).subscribe({
            next: (data) => {
                this.summaryData = this.calculateHealthMetrics(data.summary);
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

    private loadChartsData(forceRefresh: boolean = false): void {
        if (!this.chartsSelectedTenant) return;

        this.tenantDataService.getTenantHealthData(
            this.chartsSelectedTenant.id,
            this.chartsSelectedUseCase?.id,
            forceRefresh
        ).subscribe({
            next: (data) => {
                this.prepareAccountChartGroups(data.accounts);
            },
            error: (error) => {
                this.handleError('Failed to load charts data.', error);
            }
        });
    }

    private calculateHealthMetrics(summary: any): any {
        const total = summary.passed + summary.failed + summary.error + summary.cancelled;
        const passRate = total > 0 ? ((summary.passed / total) * 100).toFixed(1) : '0';
        const failureRate = total > 0 ? (((summary.failed + summary.error) / total) * 100).toFixed(1) : '0';
        const availability = total > 0 ? (((total - summary.cancelled) / total) * 100).toFixed(1) : '0';

        return {
            ...summary,
            passRate: `${passRate}%`,
            failureRate: `${failureRate}%`,
            availability: `${availability}%`,
            healthScore: this.calculateHealthScore(summary)
        };
    }

    private calculateHealthScore(summary: any): number {
        const total = summary.passed + summary.failed + summary.error + summary.cancelled;
        if (total === 0) return 0;

        const passWeight = 0.4;
        const failWeight = 0.3;
        const errorWeight = 0.2;
        const cancelWeight = 0.1;

        const score = (
            (summary.passed / total) * passWeight * 100 +
            (1 - summary.failed / total) * failWeight * 100 +
            (1 - summary.error / total) * errorWeight * 100 +
            (1 - summary.cancelled / total) * cancelWeight * 100
        );

        return Math.round(score);
    }

    private prepareAccountChartGroups(accountsData: any): void {
        this.accountChartGroups = [];

        // Group accounts by use case
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
                    '#4CAF50', // Green for passed
                    '#F44336', // Red for failed
                    '#FF9800', // Orange for error
                    '#9E9E9E'  // Grey for cancelled
                ],
                successRate: accountData.successRate,
                accountType: accountData.accountType,
                useCase: accountData.useCase
            };

            groupedData[useCase].push(chartData);
        });

        // Convert grouped data to array with proper formatting
        Object.keys(groupedData).forEach(useCase => {
            this.accountChartGroups.push({
                useCaseTitle: this.formatUseCaseTitle(useCase),
                useCase: useCase,
                charts: groupedData[useCase]
            });
        });

        // Sort groups by use case order (One Time, Recurring, All)
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
        return accountType.toUpperCase(); // ACH, DEBIT
    }

    // Handler for SUMMARY filter-bar events
    onSummaryDateRangeChanged(option: any): void {
        this.summarySelectedDateRange = option.label;
        this.loadSummaryData();
    }

    onSummaryTenantChanged(tenant: Tenant): void {
        this.summarySelectedTenant = tenant;
        // Update available use cases when tenant changes
        this.availableUseCases = tenant.useCases;
        this.summarySelectedUseCase = null; // Reset use case selection
        this.loadSummaryData();
    }

    onSummaryUseCaseChanged(useCase: UseCase): void {
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

    onChartsTenantChanged(tenant: Tenant): void {
        this.chartsSelectedTenant = tenant;
        // Update available use cases when tenant changes
        this.availableUseCases = tenant.useCases;
        this.chartsSelectedUseCase = null; // Reset use case selection
        this.loadChartsData();
    }

    onChartsUseCaseChanged(useCase: UseCase): void {
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

    trackByChartTitle(index: number, chart: any): string {
        return chart.title;
    }

    trackByGroupTitle(index: number, group: any): string {
        return group.useCaseTitle;
    }

    // Add the missing legend helper methods
    getSharedLegendLabels(): string[] {
        return ['Passed', 'Failed', 'Error', 'Cancelled'];
    }

    getSharedLegendColors(): string[] {
        return [
            '#4CAF50', // Green for passed
            '#F44336', // Red for failed
            '#FF9800', // Orange for error
            '#9E9E9E'  // Grey for cancelled
        ];
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
}