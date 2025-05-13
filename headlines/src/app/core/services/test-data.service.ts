// src/app/core/services/test-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  private cache: Map<string, any> = new Map();
  private lastRefresh: Date = new Date();

  constructor(private http: HttpClient) { }

  getTestCaseResults(filters?: any, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `test-cases-${JSON.stringify(filters || {})}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<any>('assets/mock-data/test-cases.json').pipe(
      delay(500), // Simulate network delay
      map(data => this.applyFilters(data, filters)),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }

  getTestResultsSummary(filters?: any, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `test-results-summary-${JSON.stringify(filters || {})}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Fallback data in case the HTTP request fails
    const fallbackData = {
      total: 1000,
      passed: 650,
      failed: 80,
      error: 120,
      cancelled: 150,
      inProgress: 16,
      totalExecutionTime: "6d 3h 12m 3s"
    };

    return this.http.get<any>('assets/mock-data/test-results.json').pipe(
      delay(500),
      map(data => data.summary),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(error => {
        console.error('Error loading test results summary:', error);
        return of(fallbackData);
      })
    );
  }

  getDailyTestResults(filters?: any, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `daily-test-results-${JSON.stringify(filters || {})}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Fallback data in case the HTTP request fails
    const fallbackData = [
      {
        date: "2025-05-10",
        passed: 92,
        failed: 12,
        error: 5,
        cancelled: 2
      },
      {
        date: "2025-05-11",
        passed: 85,
        failed: 15,
        error: 7,
        cancelled: 4
      },
      {
        date: "2025-05-12",
        passed: 95,
        failed: 10,
        error: 3,
        cancelled: 1
      }
    ];

    return this.http.get<any>('assets/mock-data/test-results.json').pipe(
      delay(500),
      map(data => data.dailyResults),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(error => {
        console.error('Error loading daily test results:', error);
        return of(fallbackData);
      })
    );
  }

  getLongestRunningTestCases(limit: number = 10, forceRefresh: boolean = false): Observable<any[]> {
    const cacheKey = `longest-running-test-cases-${limit}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Fallback data in case the HTTP request fails
    const fallbackData = [
      { id: 'TC-003', name: 'Check if data is committed to the database', executionTime: 420, maxExecutionTime: 504, model: 'Shopping Cart' },
      { id: 'TC-002', name: 'Login using invalid password', executionTime: 86, maxExecutionTime: 103.2, model: 'Login' },
      { id: 'TC-001', name: 'Login using valid credentials', executionTime: 20, maxExecutionTime: 24, model: 'Shopping Cart' }
    ];

    return this.http.get<any>('assets/mock-data/test-cases.json').pipe(
      delay(500),
      map(data => {
        const testCases = data.testCases || [];
        // Sort by execution time in descending order
        return testCases
          .sort((a: any, b: any) => b.executionTime - a.executionTime)
          .slice(0, limit)
          .map((testCase: any) => ({
            ...testCase,
            // Add maxExecutionTime property
            maxExecutionTime: testCase.executionTime * 1.2
          }));
      }),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(error => {
        console.error('Error loading longest running test cases:', error);
        return of(fallbackData);
      })
    );
  }

  getTopTestCaseFailures(limit: number = 10, forceRefresh: boolean = false): Observable<any[]> {
    const cacheKey = `top-test-case-failures-${limit}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<any>('assets/mock-data/test-cases.json').pipe(
      delay(500),
      map(data => {
        const testCases = data.testCases || [];
        // We need more mock data for this, let's generate some
        const mockFailures = [
          { id: 'TC-004', name: 'Check login error messages', failures: 120, model: 'Login' },
          { id: 'TC-005', name: 'Verify payment processing', failures: 87, model: 'Payment' },
          { id: 'TC-006', name: 'Test search functionality', failures: 65, model: 'Search' },
          { id: 'TC-007', name: 'Add item to cart validation', failures: 54, model: 'Shopping Cart' },
          { id: 'TC-008', name: 'User registration with existing email', failures: 43, model: 'Account' },
          { id: 'TC-009', name: 'Checkout with invalid shipping address', failures: 32, model: 'Checkout' },
          { id: 'TC-010', name: 'Product filtering by category', failures: 28, model: 'Products' },
          // Include the failures from our original testCases
          ...testCases.filter((tc: any) => tc.failures > 0)
        ];

        // Sort by failures in descending order
        return mockFailures
          .sort((a: any, b: any) => b.failures - a.failures)
          .slice(0, limit);
      }),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }

  getTopTestCaseErrors(limit: number = 10, forceRefresh: boolean = false): Observable<any[]> {
    const cacheKey = `top-test-case-errors-${limit}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // For this mock, we'll simulate errors as a separate type of issue
    const mockErrors = [
      { id: 'TC-011', name: 'Database connection test', errors: 75, model: 'Database' },
      { id: 'TC-012', name: 'API integration check', errors: 68, model: 'API' },
      { id: 'TC-013', name: 'Third-party service connection', errors: 54, model: 'Integration' },
      { id: 'TC-014', name: 'Image upload validation', errors: 47, model: 'Media' },
      { id: 'TC-015', name: 'Password reset functionality', errors: 41, model: 'Account' },
      { id: 'TC-016', name: 'Session timeout handling', errors: 36, model: 'Authentication' },
      { id: 'TC-017', name: 'Order cancellation process', errors: 29, model: 'Orders' },
      { id: 'TC-018', name: 'Payment gateway timeout', errors: 24, model: 'Payment' },
      { id: 'TC-019', name: 'User profile update', errors: 18, model: 'Profile' },
      { id: 'TC-020', name: 'Product review submission', errors: 12, model: 'Reviews' }
    ];

    return of(mockErrors).pipe(
      delay(500),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }

  clearCache(): void {
    this.cache.clear();
    this.lastRefresh = new Date();
  }

  getLastRefreshTime(): Date {
    return this.lastRefresh;
  }

  private applyFilters(data: any, filters?: any): any {
    if (!filters) return data;

    // Apply filtering logic - simplified for demo
    return data;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    let errorMessage = 'An error occurred while loading data.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}