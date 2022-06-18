import { TestBed } from '@angular/core/testing';

import { TimeTrackingPeriodsService } from './time-tracking-periods.service';

describe('TimeTrackingPeriodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeTrackingPeriodsService = TestBed.get(TimeTrackingPeriodsService);
    expect(service).toBeTruthy();
  });
});
