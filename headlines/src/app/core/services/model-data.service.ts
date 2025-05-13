// src/app/core/services/model-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelDataService {
  private cache: Map<string, any> = new Map();
  private lastRefresh: Date = new Date();

  constructor(private http: HttpClient) { }

  getModelData(modelId: string, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `model-${modelId}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<any>('assets/mock-data/model-data.json').pipe(
      delay(500), // Simulate network delay
      map(data => {
        // Find the model by ID or return the first one if not found
        const model = data.models.find((m: any) => m.id === modelId) || data.models[0];
        return model;
      }),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }

  getModelTestResults(modelId: string, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `model-test-results-${modelId}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Mock test results for a model
    const mockData = {
      testResultsRecord: {
        pass: 1054,
        fail: 42,
        incomplete: 23
      },
      allRuns: {
        pass: 1054,
        fail: 0,
        incomplete: 0
      },
      testCaseCompletion: {
        completed: 1,
        incomplete: 0
      },
      failureType: {
        exploratoryFails: 0,
        directedFails: 0
      },
      coverage: {
        covered: 85,
        remaining: 15
      },
      testBreakdown: [
        {
          name: "Dummy Test Case",
          passCount: 120,
          failCount: 0
        }
      ]
    };

    return of(mockData).pipe(
      delay(500),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }

  getAvailableModels(forceRefresh: boolean = false): Observable<any[]> {
    const cacheKey = 'available-models';

    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Fallback data in case the HTTP request fails
    const fallbackData = [
      {
        id: "model-001",
        name: "Shopping Cart",
        automatedStates: 3,
        totalStates: 8,
        automatedActions: 7,
        totalActions: 8
      },
      {
        id: "model-002",
        name: "Login",
        automatedStates: 5,
        totalStates: 6,
        automatedActions: 12,
        totalActions: 15
      }
    ];

    return this.http.get<any>('assets/mock-data/model-data.json').pipe(
      delay(300),
      map(data => data.models),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(error => {
        console.error('Error loading available models:', error);
        return of(fallbackData);
      })
    );
  }

  
  clearCache(): void {
    this.cache.clear();
    this.lastRefresh = new Date();
  }

  getLastRefreshTime(): Date {
    return this.lastRefresh;
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