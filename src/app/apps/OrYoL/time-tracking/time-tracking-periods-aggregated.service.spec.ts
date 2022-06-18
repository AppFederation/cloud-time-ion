import { TestBed } from '@angular/core/testing';

import { TimeTrackingPeriodsAggregatedService } from './time-tracking-periods-aggregated.service';

describe('TimeTrackingPeriodsAggregatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeTrackingPeriodsAggregatedService = TestBed.get(TimeTrackingPeriodsAggregatedService);
    expect(service).toBeTruthy();
  });
});
