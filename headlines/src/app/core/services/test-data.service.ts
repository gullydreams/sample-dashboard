import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  constructor(private http: HttpClient) {}

  getTestCaseResults(filters?: any): Observable<any> {
    return this.http.get<any>('assets/mock-data/test-cases.json').pipe(
      delay(500), // Simulate network delay
      map(data => this.applyFilters(data, filters))
    );
  }

  getTestResultsSummary(filters?: any): Observable<any> {
    return this.http.get<any>('assets/mock-data/test-results.json').pipe(
      delay(500),
      map(data => data.summary)
    );
  }

  getDailyTestResults(filters?: any): Observable<any> {
    return this.http.get<any>('assets/mock-data/test-results.json').pipe(
      delay(500),
      map(data => data.dailyResults)
    );
  }

  private applyFilters(data: any, filters?: any): any {
    if (!filters) return data;
    
    // Apply filtering logic - simplified for demo
    return data;
  }

  getLongestRunningTestCases(limit: number = 10): Observable<any[]> {
    return this.http.get<any>('assets/mock-data/test-cases.json').pipe(
      delay(500),
      map(data => {
        const testCases = data.testCases || [];
        // Sort by execution time in descending order
        return testCases
          .sort((a: any, b: any) => b.executionTime - a.executionTime)
          .slice(0, limit);
      })
    );
  }

  getTopTestCaseFailures(limit: number = 10): Observable<any[]> {
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
      })
    );
  }

  getTopTestCaseErrors(limit: number = 10): Observable<any[]> {
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
    
    return of(mockErrors).pipe(delay(500));
  }
} 