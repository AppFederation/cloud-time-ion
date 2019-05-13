import { TestBed } from '@angular/core/testing';

import { TimerNotificationsService } from './timer-notifications.service';

describe('TimerNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimerNotificationsService = TestBed.get(TimerNotificationsService);
    expect(service).toBeTruthy();
  });
});
