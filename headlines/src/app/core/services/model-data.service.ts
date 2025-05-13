import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelDataService {
  constructor(private http: HttpClient) {}

  getModelData(modelId: string): Observable<any> {
    // In a real app, this would call an API endpoint with the modelId
    return this.http.get<any>('assets/mock-data/model-data.json').pipe(
      delay(500), // Simulate network delay
      map(data => {
        // Find the model by ID or return the first one if not found
        const model = data.models.find((m: any) => m.id === modelId) || data.models[0];
        return model;
      })
    );
  }

  getModelTestResults(modelId: string): Observable<any> {
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
    
    return of(mockData).pipe(delay(500));
  }

  getAvailableModels(): Observable<any[]> {
    return this.http.get<any>('assets/mock-data/model-data.json').pipe(
      delay(300),
      map(data => data.models)
    );
  }
}