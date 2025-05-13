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
}