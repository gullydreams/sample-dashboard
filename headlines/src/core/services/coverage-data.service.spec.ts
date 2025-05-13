import { TestBed } from '@angular/core/testing';

import { CoverageDataService } from './coverage-data.service';

describe('CoverageDataService', () => {
  let service: CoverageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
