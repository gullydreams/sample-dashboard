// src/app/core/services/tenant-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';

export interface Account {
    id: string;
    name: string;
    type: 'ACH' | 'Debit';
}

export interface UseCase {
    id: string;
    name: string;
    accounts: Account[];
}

export interface Tenant {
    id: string;
    name: string;
    useCases: UseCase[];
}

@Injectable({
    providedIn: 'root'
})
export class TenantDataService {
    private cache: Map<string, any> = new Map();
    private lastRefresh: Date = new Date();

    constructor() { }

    getTenants(): Observable<Tenant[]> {
        const cacheKey = 'tenants';

        if (this.cache.has(cacheKey)) {
            return of(this.cache.get(cacheKey));
        }

        const tenants: Tenant[] = [
            {
                id: 'recoveries',
                name: 'Recoveries',
                useCases: [
                    {
                        id: 'all',
                        name: 'All',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'one-time',
                        name: 'One time',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'recurring',
                        name: 'Recurring',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' }
                        ]
                    }
                ]
            },
            {
                id: 'card',
                name: 'Card',
                useCases: [
                    {
                        id: 'all',
                        name: 'All',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'one-time',
                        name: 'One time',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'recurring',
                        name: 'Recurring',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' }
                        ]
                    }
                ]
            },
            {
                id: 'coaf',
                name: 'COAF',
                useCases: [
                    {
                        id: 'all',
                        name: 'All',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'one-time',
                        name: 'One time',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'recurring',
                        name: 'Recurring',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' }
                        ]
                    }
                ]
            },
            {
                id: 'secured-card',
                name: 'Secured Card',
                useCases: [
                    {
                        id: 'all',
                        name: 'All',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'one-time',
                        name: 'One time',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' },
                            { id: 'debit', name: 'Debit', type: 'Debit' }
                        ]
                    },
                    {
                        id: 'recurring',
                        name: 'Recurring',
                        accounts: [
                            { id: 'ach', name: 'ACH', type: 'ACH' }
                        ]
                    }
                ]
            }
        ];

        return of(tenants).pipe(
            delay(300),
            tap(data => {
                this.cache.set(cacheKey, data);
                this.lastRefresh = new Date();
            }),
            catchError(error => {
                console.error('Error loading tenants:', error);
                return of(tenants);
            })
        );
    }

    getTenantHealthData(tenantId: string, useCaseId?: string, forceRefresh: boolean = false): Observable<any> {
        const cacheKey = `tenant-health-${tenantId}-${useCaseId || 'all'}`;

        if (!forceRefresh && this.cache.has(cacheKey)) {
            return of(this.cache.get(cacheKey));
        }

        // Mock health data for each account
        const mockData = this.generateMockHealthData(tenantId, useCaseId);

        return of(mockData).pipe(
            delay(500),
            tap(data => {
                this.cache.set(cacheKey, data);
                this.lastRefresh = new Date();
            }),
            catchError(error => {
                console.error('Error loading tenant health data:', error);
                return of(mockData);
            })
        );
    }

    private generateMockHealthData(tenantId: string, useCaseId?: string): any {
        // Generate different data based on tenant and use case
        const baseData = {
            summary: {
                total: 1000,
                passed: Math.floor(Math.random() * 200) + 600, // 600-800
                failed: Math.floor(Math.random() * 50) + 50,   // 50-100
                error: Math.floor(Math.random() * 30) + 70,    // 70-100
                cancelled: Math.floor(Math.random() * 20) + 80, // 80-100
                inProgress: Math.floor(Math.random() * 10) + 5   // 5-15
            },
            accounts: {}
        };

        // Calculate remaining values to ensure total adds up
        const remaining = 1000 - (baseData.summary.passed + baseData.summary.failed + baseData.summary.error + baseData.summary.cancelled + baseData.summary.inProgress);
        if (remaining > 0) {
            baseData.summary.passed += remaining;
        }

        // Generate account-specific data
        if (!useCaseId || useCaseId === 'all') {
            // Show data for all use cases
            baseData.accounts = {
                'one-time-ach': this.generateAccountData('ACH', 'one-time'),
                'one-time-debit': this.generateAccountData('Debit', 'one-time'),
                'recurring-ach': this.generateAccountData('ACH', 'recurring')
            };
        } else {
            // Show data for specific use case
            if (useCaseId === 'one-time') {
                baseData.accounts = {
                    'one-time-ach': this.generateAccountData('ACH', 'one-time'),
                    'one-time-debit': this.generateAccountData('Debit', 'one-time')
                };
            } else if (useCaseId === 'recurring') {
                baseData.accounts = {
                    'recurring-ach': this.generateAccountData('ACH', 'recurring')
                };
            }
        }

        return baseData;
    }

    private generateAccountData(accountType: string, useCase: string): any {
        const total = Math.floor(Math.random() * 200) + 300; // 300-500
        const passed = Math.floor(total * (0.6 + Math.random() * 0.2)); // 60-80%
        const failed = Math.floor(total * (0.05 + Math.random() * 0.1)); // 5-15%
        const error = Math.floor(total * (0.05 + Math.random() * 0.1));  // 5-15%
        const remaining = total - (passed + failed + error);
        const cancelled = remaining > 0 ? remaining : 0;

        return {
            accountType,
            useCase,
            total,
            passed,
            failed,
            error,
            cancelled,
            successRate: ((passed / total) * 100).toFixed(1),
            lastUpdated: new Date().toISOString()
        };
    }

    clearCache(): void {
        this.cache.clear();
        this.lastRefresh = new Date();
    }

    getLastRefreshTime(): Date {
        return this.lastRefresh;
    }
}