import { TestBed } from '@angular/core/testing';

import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SchedulerService]
  }));

  it('should be created', () => {
    const service = TestBed.get(SchedulerService);
    expect(service).toBeTruthy();
  });
});
