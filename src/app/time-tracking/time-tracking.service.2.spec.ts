import { TestBed } from '@angular/core/testing';

import {
  TimeTrackedEntry,
  TimeTrackingService,
} from './time-tracking.service';
import { DebugService } from '../core/debug.service'
import { TimeService } from '../core/time.service'
import { HasItemData } from '../tree-model/has-item-data'

class MockHasItemData implements HasItemData {
  mockItemData

  patchItemData(itemDataToPatch: any) {
    this.mockItemData = {
      ...{},
      ... this.mockItemData,
      ... itemDataToPatch,
    }
  }
}

class MockTimeService implements TimeService {
  private mockTime = new Date(0)

  now() {
    return this.mockTime
  }

  advanceMs(msDiff: number) {
    this.mockTime = new Date(this.mockTime.getTime() + msDiff)
  }
}

const mockTimeService = new MockTimeService()

describe('TimeTrackingService 2', () => {
  let timeTrackingService: TimeTrackingService
  DebugService.isDebug = true
  let mockHasItemData: MockHasItemData
  let tte: TimeTrackedEntry

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeTrackingService,
        { provide: TimeService, useValue: mockTimeService },
      ]
    })
    timeTrackingService = TestBed.get(TimeTrackingService);
    mockHasItemData = new MockHasItemData()
    tte = new TimeTrackedEntry(timeTrackingService, mockHasItemData)
  });

  it('should be created', () => {
    expect(timeTrackingService).toBeTruthy();
  });

  it('reports zero time tracked right after tracking starts', () => {
    tte.beginTimeTracking()
    expect (tte.totalMsExcludingPauses).toBe(0)
  })


  it('starts tracking', () => {
    tte.beginTimeTracking()
    expect(tte.isTrackingNow).toBeTruthy()
    expect(mockHasItemData.mockItemData.timeTrack.currentTrackingSince.getTime())
      .toEqual(mockTimeService.now().getTime())
    expect(mockHasItemData.mockItemData.timeTrack.currentTrackingSince)
      .toEqual(mockTimeService.now())
    // service.startTimeTrackingOf('ttItem')
    // expect(timeTrackingService.timeTrackingOf$.lastVal).toBe('ttItem')
    // expect(timeTrackingService.isTimeTracking('ttItem')).toBe(true)
    // expect(timeTrackingService.isTimeTracking('ttItem2')).toBe(false)
  })

  it('reports time tracked after time passes after starting', () => {
    tte.beginTimeTracking()
    mockTimeService.advanceMs(777)
    expect(tte.totalMsExcludingPauses).toBe(777) // ASSERT
    mockTimeService.advanceMs(100)
    expect(tte.totalMsExcludingPauses).toBe(877) // ASSERT
  })


  it('does not accumulate more time after paused', () => {
    tte.beginTimeTracking()
    mockTimeService.advanceMs(999)
    // expect (tte.totalMsExcludingPauses).toBe(999)
    tte.pause() // ==== ACT
    expect(tte.isPaused).toBeTruthy()
    expect(tte.isTrackingNow).toBeFalsy()
    expect(tte.totalMsExcludingPauses).toBe(999) // sanity check
    expect(tte.currentPauseMsTillNow).toBe(0) // sanity check
    mockTimeService.advanceMs(111)
    expect(tte.currentPauseMsTillNow).toBe(111)
    expect (tte.totalMsExcludingPauses).toBe(999)
  })

  it('resumes accumulating time after resume', () => {
    tte.beginTimeTracking()
    mockTimeService.advanceMs(999)
    tte.pause()
    mockTimeService.advanceMs(111)
    tte.beginTimeTracking() // ======== ACT // FIXME: have a method startOrResumeTracking()
    expect(tte.isPaused).toBeFalsy()
    expect(tte.isTrackingNow).toBeTruthy()
    mockTimeService.advanceMs(100)
    expect (tte.totalMsExcludingPauses).toBe(1099)
  })

  it('keeps whenFirstStarted when resuming', () => {
    tte.beginTimeTracking()
    const whenFirstStarted = tte.startTime
    mockTimeService.advanceMs(999) // optional
    tte.pause()
    mockTimeService.advanceMs(111) // optional
    tte.beginTimeTracking()
    expect(tte.startTime).toBe(whenFirstStarted)
  })


  it('stops time tracking and reports false', () => {
    timeTrackingService.startTimeTrackingOf('ttItem')
    timeTrackingService.stopTimeTrackingOf('ttItem')
    expect(timeTrackingService.isTimeTracking('ttItem')).toBe(false)
    expect(timeTrackingService.isTimeTracking('ttItem2')).toBe(false)
  })
});
