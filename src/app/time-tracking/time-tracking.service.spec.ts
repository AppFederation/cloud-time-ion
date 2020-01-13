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

  getItemData() {
    return this.mockItemData
  }

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

describe('TimeTrackingService', () => {
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

  // ==== describe(`when pre-existing persistent data`

  it('handles not-yet-present time-tracking data', () => {
    tte.startOrResumeTrackingIfNeeded()
  })

  it(`handles existing persistent data that says tracking`)

  it(`handles existing persistent data that says paused`)

  it('reports zero time tracked right after tracking starts', () => {
    tte.startOrResumeTrackingIfNeeded()
    expect (tte.totalMsExcludingPauses).toBe(0)
  })

  it('starts tracking', () => {
    tte.startOrResumeTrackingIfNeeded()
    expect(tte.isTrackingNow).toBeTruthy()
    expect(mockHasItemData.mockItemData.timeTrack.nowTrackingSince.getTime())
      .toEqual(mockTimeService.now().getTime())
    expect(mockHasItemData.mockItemData.timeTrack.nowTrackingSince)
      .toEqual(mockTimeService.now())
  })

  it('reports time tracked after time passes after starting', () => {
    tte.startOrResumeTrackingIfNeeded()
    mockTimeService.advanceMs(777)
    expect(tte.totalMsExcludingPauses).toBe(777) // ASSERT
    mockTimeService.advanceMs(100)
    expect(tte.totalMsExcludingPauses).toBe(877) // ASSERT
  })

  it('does not accumulate more time after paused', () => {
    tte.startOrResumeTrackingIfNeeded()
    mockTimeService.advanceMs(999)
    expect (tte.totalMsExcludingPauses).toBe(999)
    tte.pauseOrNoop() // ==== ACT
    expect(tte.isPaused).toBeTruthy()
    expect(tte.isTrackingNow).toBeFalsy()
    expect(tte.totalMsExcludingPauses).toBe(999) // sanity check
    expect(tte.currentPauseMsTillNow).toBe(0) // sanity check
    mockTimeService.advanceMs(111)
    expect (tte.totalMsExcludingPauses).toBe(999)
    expect(tte.currentPauseMsTillNow).toBe(111)
  })

  it('resumes accumulating time after resume', () => {
    tte.startOrResumeTrackingIfNeeded()
    mockTimeService.advanceMs(999)
    tte.pauseOrNoop()
    mockTimeService.advanceMs(111) // paused
    tte.startOrResumeTrackingIfNeeded() // ======== ACT
    expect(tte.isPaused).toBeFalsy()
    expect(tte.isTrackingNow).toBeTruthy()
    mockTimeService.advanceMs(100)
    expect (tte.totalMsExcludingPauses).toBe(1099)
  })

  it('keeps whenFirstStarted when resuming', () => {
    tte.startOrResumeTrackingIfNeeded()
    const whenFirstStarted = tte.whenFirstStarted
    mockTimeService.advanceMs(999) // optional
    tte.pauseOrNoop()
    mockTimeService.advanceMs(111) // optional
    tte.startOrResumeTrackingIfNeeded()
    expect(tte.whenFirstStarted).toBe(whenFirstStarted)
  })

});
