import { TestBed } from '@angular/core/testing';

import { TimeTrackingService } from './time-tracking.service';
import { DebugService } from '../core/debug.service'

describe('TimeTrackingService', () => {
  let service: TimeTrackingService
  DebugService.isDebug = true
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeTrackingService]
    })
    service = TestBed.get(TimeTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts time tracking and reports true', () => {
    service.startTimeTrackingOf('ttItem')
    expect(service.timeTrackingOf$.lastVal).toBe('ttItem')
    expect(service.isTimeTracking('ttItem')).toBe(true)
    expect(service.isTimeTracking('ttItem2')).toBe(false)
  })

  it('stops time tracking and reports false', () => {
    service.startTimeTrackingOf('ttItem')
    service.stopTimeTrackingOf('ttItem')
    expect(service.isTimeTracking('ttItem')).toBe(false)
    expect(service.isTimeTracking('ttItem2')).toBe(false)
  })
});
