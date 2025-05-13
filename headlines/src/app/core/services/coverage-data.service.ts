// src/app/core/services/coverage-data.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoverageDataService {
  private cache: Map<string, any> = new Map();
  private lastRefresh: Date = new Date();

  constructor() { }

  getModelCoverage(modelId: string, forceRefresh: boolean = false): Observable<any> {
    const cacheKey = `model-coverage-${modelId}`;
    
    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    // Mock data for coverage information
    const mockCoverage = {
      modelInfo: {
        automatedActions: 7,
        totalActions: 8,
        automatedStates: 3,
        totalStates: 8
      },
      bugHunting: {
        failingActions: [
          {
            name: 'Check the Keysight landing page / Product and services',
            count: 1
          }
        ],
        failingTags: []
      },
      coverage: {
        allNodes: 85,
        allPairs: 78,
        extended: 60,
        fullExploratory: 42
      },
      testCases: {
        run: 15,
        notRun: 5,
        hits: 62
      },
      testResults: {
        pass: 42,
        fail: 8,
        error: 12,
        cancelled: 15,
        inProgress: 0,
        runs: 77,
        duration: '5h 23m',
        passRate: '65%'
      }
    };
    
    return of(mockCoverage).pipe(
      delay(600),
      tap(data => {
        this.cache.set(cacheKey, data);
        this.lastRefresh = new Date();
      }),
      catchError(this.handleError)
    );
  }
  
  getBugHuntingHistory(modelId: string, forceRefresh: boolean = false): Observable<any[]> {
    const cacheKey = `bug-hunting-history-${modelId}`;
    
    if (!forceRefresh && this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    // Mock data for bug hunting history
    const mockBugHunting = [
      {
        actionName: 'Check the Keysight landing page / Product and services',
        totalRuns: 12,
        failedRuns: 1,
        lastRun: '2025-05-10T14:23:45',
        tags: ['UI', 'Landing Page']
      }
    ];
    
    return of(mockBugHunting).pipe(
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
  
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    
    let errorMessage = 'An error occurred while loading data.';
    
    if (error instanceof Error) {
      // Client-side error
      errorMessage = `Error: ${error.message}`;
    } else {
      // Server-side error if HttpErrorResponse
      errorMessage = `Error: ${error.message || 'Unknown error'}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}