// src/app/core/services/bdd-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { BddScenario, BddFilters, BddSummary } from '../models/bdd-models';

@Injectable({
    providedIn: 'root'
})
export class BddDataService {
    private cache: Map<string, any> = new Map();
    private lastRefresh: Date = new Date();

    constructor() { }

    getBddScenarios(filters: BddFilters, forceRefresh: boolean = false): Observable<BddScenario[]> {
        const cacheKey = `bdd-scenarios-${JSON.stringify(filters)}`;

        if (!forceRefresh && this.cache.has(cacheKey)) {
            return of(this.cache.get(cacheKey));
        }

        // Generate mock BDD scenarios based on filters
        const mockScenarios = this.generateMockBddScenarios(filters);

        return of(mockScenarios).pipe(
            delay(800),
            tap(data => {
                this.cache.set(cacheKey, data);
                this.lastRefresh = new Date();
            }),
            catchError(error => {
                console.error('Error loading BDD scenarios:', error);
                return of([]);
            })
        );
    }

    getBddSummary(filters: BddFilters, forceRefresh: boolean = false): Observable<BddSummary> {
        const cacheKey = `bdd-summary-${JSON.stringify(filters)}`;

        if (!forceRefresh && this.cache.has(cacheKey)) {
            return of(this.cache.get(cacheKey));
        }

        const mockSummary = this.generateMockBddSummary(filters);

        return of(mockSummary).pipe(
            delay(500),
            tap(data => {
                this.cache.set(cacheKey, data);
                this.lastRefresh = new Date();
            }),
            catchError(error => {
                console.error('Error loading BDD summary:', error);
                return of({
                    totalScenarios: 0,
                    passedScenarios: 0,
                    failedScenarios: 0,
                    skippedScenarios: 0,
                    pendingScenarios: 0,
                    totalDuration: 0,
                    successRate: 0,
                    recentFailures: [],
                    commonTags: []
                });
            })
        );
    }

    private generateMockBddScenarios(filters: BddFilters): BddScenario[] {
        const scenarios: BddScenario[] = [];
        const tenantName = this.getTenantName(filters.tenantId || '');
        const useCaseName = this.getUseCaseName(filters.useCaseId || '');

        // Use the filtered account type, or default to both if not specified
        const accountTypes = filters.accountType ? [filters.accountType] : ['ACH', 'Debit'];

        // Define step template interface
        interface StepTemplate {
            keyword: 'Given' | 'When' | 'Then' | 'And' | 'But';
            text: string;
            status: 'passed' | 'failed' | 'skipped' | 'pending';
            errorMessage?: string;
            expectedResult?: string;
            actualResult?: string;
            stackTrace?: string;
        }

        accountTypes.forEach(accountType => {
            // Generate different scenarios based on filters
            const scenarioTemplates: {
                name: string;
                feature: string;
                status: 'passed' | 'failed' | 'skipped' | 'pending';
                tags: string[];
                steps: StepTemplate[];
            }[] = [
                    {
                        name: `Valid ${accountType} Transfer`,
                        feature: 'Payment Processing',
                        status: 'passed',
                        tags: ['@payment', `@${accountType.toLowerCase()}`, '@positive'],
                        steps: [
                            { keyword: 'Given', text: `I have a valid ${accountType} account`, status: 'passed' },
                            { keyword: 'When', text: 'I initiate a payment transfer', status: 'passed' },
                            { keyword: 'Then', text: 'the payment should be processed successfully', status: 'passed' },
                            { keyword: 'And', text: 'I should receive a confirmation', status: 'passed' },
                            { keyword: 'And', text: 'the balance should be updated', status: 'passed' }
                        ]
                    },
                    {
                        name: `Invalid ${accountType} Account Number`,
                        feature: 'Payment Validation',
                        status: 'failed',
                        tags: ['@payment', '@validation', `@${accountType.toLowerCase()}`, '@negative'],
                        steps: [
                            { keyword: 'Given', text: 'I am on the payment page', status: 'passed' },
                            { keyword: 'When', text: 'I enter an invalid account number', status: 'passed' },
                            {
                                keyword: 'Then',
                                text: 'the account should be validated',
                                status: 'failed',
                                errorMessage: 'Invalid account number format',
                                expectedResult: 'Valid ACH account format (9 digits)',
                                actualResult: 'Account number contains special characters',
                                stackTrace: 'ValidationError at line 45 in AccountValidator.js'
                            },
                            { keyword: 'And', text: 'I should see confirmation message', status: 'skipped' },
                            { keyword: 'And', text: 'payment should be processed', status: 'skipped' }
                        ]
                    },
                    {
                        name: `${accountType} Payment Timeout`,
                        feature: 'Payment Processing',
                        status: 'failed',
                        tags: ['@payment', `@${accountType.toLowerCase()}`, '@timeout', '@negative'],
                        steps: [
                            { keyword: 'Given', text: `I have a valid ${accountType} account`, status: 'passed' },
                            {
                                keyword: 'When',
                                text: 'I initiate a payment with slow network',
                                status: 'failed',
                                errorMessage: 'Database connection timeout',
                                expectedResult: 'Payment processed within 5 seconds',
                                actualResult: 'Connection timed out after 5000ms',
                                stackTrace: 'TimeoutError at PaymentService.processPayment()'
                            },
                            { keyword: 'Then', text: 'the payment should be processed', status: 'skipped' },
                            { keyword: 'And', text: 'I should receive confirmation', status: 'skipped' }
                        ]
                    },
                    {
                        name: `${useCaseName} ${accountType} Authorization`,
                        feature: 'Authorization',
                        status: 'passed',
                        tags: ['@authorization', `@${accountType.toLowerCase()}`, '@positive'],
                        steps: [
                            { keyword: 'Given', text: 'I am an authorized user', status: 'passed' },
                            { keyword: 'When', text: `I access ${useCaseName} ${accountType} features`, status: 'passed' },
                            { keyword: 'Then', text: 'I should have proper access', status: 'passed' },
                            { keyword: 'And', text: 'all features should be available', status: 'passed' }
                        ]
                    },
                    {
                        name: `${accountType} Balance Inquiry`,
                        feature: 'Account Management',
                        status: 'passed',
                        tags: ['@account', `@${accountType.toLowerCase()}`, '@inquiry', '@positive'],
                        steps: [
                            { keyword: 'Given', text: `I have a ${accountType} account with balance`, status: 'passed' },
                            { keyword: 'When', text: 'I request balance information', status: 'passed' },
                            { keyword: 'Then', text: 'I should see current balance', status: 'passed' },
                            { keyword: 'And', text: 'balance should be accurate', status: 'passed' }
                        ]
                    },
                    {
                        name: `${accountType} Transaction History`,
                        feature: 'Account Management',
                        status: 'skipped',
                        tags: ['@account', `@${accountType.toLowerCase()}`, '@history', '@skip'],
                        steps: [
                            { keyword: 'Given', text: `I have a ${accountType} account`, status: 'passed' },
                            { keyword: 'When', text: 'I request transaction history', status: 'skipped' },
                            { keyword: 'Then', text: 'I should see transaction list', status: 'skipped' }
                        ]
                    }
                ];

            scenarioTemplates.forEach((template, templateIndex) => {
                const globalIndex = scenarios.length;
                const scenario: BddScenario = {
                    id: `scenario-${globalIndex + 1}`,
                    name: template.name,
                    feature: template.feature,
                    status: template.status,
                    duration: this.getRandomDuration(template.status),
                    steps: template.steps.map((step, stepIndex) => ({
                        id: `step-${globalIndex + 1}-${stepIndex + 1}`,
                        stepNumber: stepIndex + 1,
                        keyword: step.keyword,
                        text: step.text,
                        status: step.status,
                        duration: this.getRandomStepDuration(step.status),
                        errorMessage: step.errorMessage,
                        expectedResult: step.expectedResult,
                        actualResult: step.actualResult,
                        stackTrace: step.stackTrace
                    })),
                    tags: template.tags,
                    executionDate: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
                    tenantId: filters.tenantId || '',
                    useCaseId: filters.useCaseId || '',
                    accountType: accountType,
                    totalSteps: template.steps.length,
                    passedSteps: template.steps.filter(s => s.status === 'passed').length,
                    failedSteps: template.steps.filter(s => s.status === 'failed').length,
                    skippedSteps: template.steps.filter(s => s.status === 'skipped').length
                };
                scenarios.push(scenario);
            });
        });

        return scenarios;
    }

    private generateMockBddSummary(filters: BddFilters): BddSummary {
        const scenarios = this.generateMockBddScenarios(filters);

        return {
            totalScenarios: scenarios.length,
            passedScenarios: scenarios.filter(s => s.status === 'passed').length,
            failedScenarios: scenarios.filter(s => s.status === 'failed').length,
            skippedScenarios: scenarios.filter(s => s.status === 'skipped').length,
            pendingScenarios: scenarios.filter(s => s.status === 'pending').length,
            totalDuration: scenarios.reduce((sum, s) => sum + s.duration, 0),
            successRate: Math.round((scenarios.filter(s => s.status === 'passed').length / scenarios.length) * 100),
            recentFailures: [
                'Database timeout',
                'Invalid account format',
                'Network connection error'
            ],
            commonTags: ['@payment', '@validation', '@ach', '@positive', '@negative']
        };
    }

    private getRandomDuration(status: string): number {
        switch (status) {
            case 'passed': return Math.random() * 3 + 1; // 1-4 seconds
            case 'failed': return Math.random() * 5 + 1; // 1-6 seconds
            case 'skipped': return Math.random() * 0.5; // 0-0.5 seconds
            default: return Math.random() * 2 + 1;
        }
    }

    private getRandomStepDuration(status: string): number {
        switch (status) {
            case 'passed': return Math.random() * 1 + 0.1; // 0.1-1.1 seconds
            case 'failed': return Math.random() * 2 + 0.5; // 0.5-2.5 seconds
            case 'skipped': return 0;
            default: return Math.random() * 0.5 + 0.1;
        }
    }

    private getTenantName(tenantId: string): string {
        const tenantMap: { [key: string]: string } = {
            'recoveries': 'Recoveries',
            'card': 'Card',
            'coaf': 'COAF',
            'secured-card': 'Secured Card'
        };
        return tenantMap[tenantId] || 'Unknown';
    }

    private getUseCaseName(useCaseId: string): string {
        const useCaseMap: { [key: string]: string } = {
            'all': 'All',
            'one-time': 'One Time',
            'recurring': 'Recurring'
        };
        return useCaseMap[useCaseId] || 'Unknown';
    }

    clearCache(): void {
        this.cache.clear();
        this.lastRefresh = new Date();
    }

    getLastRefreshTime(): Date {
        return this.lastRefresh;
    }
}