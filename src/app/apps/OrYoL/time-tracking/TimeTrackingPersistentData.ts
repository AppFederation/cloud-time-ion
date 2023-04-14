import {TimeMsDuration} from '../../../libs/AppFedShared/time/TimeMsDuration'

/** Persistent - "Raw" in new ODM parlance */
export class TimeTrackingPersistentData {
  whenFirstStarted: Date | null = null

  // ==== tracking periods:
  previousTrackingsMs: TimeMsDuration | null = null

  nowTrackingSince: Date | null = null

  // ==== tracking pause periods:
  previousPausesMs: TimeMsDuration | null = null

  /* could rename to nowPausedSince for consistency and much shorter */
  whenCurrentPauseStarted: Date | null = null

  // /** this is for showing MRU item, even if done (could be crossed-out / grayed-out transparent) */
  // TODO whenLastTouched: Date | null = null
}
