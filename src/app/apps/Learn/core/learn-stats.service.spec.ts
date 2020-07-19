import { TestBed } from '@angular/core/testing';

import { LearnStatsService } from './learn-stats.service';

describe('LearnStatsService', () => {
  let service: LearnStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearnStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
