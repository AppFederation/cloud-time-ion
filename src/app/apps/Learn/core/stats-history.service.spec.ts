import { TestBed } from '@angular/core/testing';

import { StatsHistoryService } from './stats-history.service';

describe('StatsHistoryService', () => {
  let service: StatsHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
