import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoverageDataService {

  constructor() { }

  getModelCoverage(modelId: string): Observable<any> {
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
    
    return of(mockCoverage).pipe(delay(600));
  }
  
  getBugHuntingHistory(modelId: string): Observable<any[]> {
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
    
    return of(mockBugHunting).pipe(delay(500));
  }
}