import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/cachedSubject2/CachedSubject2'

export class Config {
  showMinMaxColumns = true
  showMissingValuesCount = true
  showAggregateValues = true /* aggregate -> https://www.thesaurus.com/browse/aggregate e.g. combined or total */
  showTimeTrackedValue = true
  planExecutionNotificationsEnabled = true
  planExecutionNotificationTimePercentages: Array<number> = [75, 95, 100, 110, 150]
}

const ORYOL_CONFIG_KEY = 'OrYoL_Config'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly config$ = new CachedSubject<Config>(
    JSON.parse(localStorage.getItem(ORYOL_CONFIG_KEY)) || new Config()
  )

  constructor() { }

  patchConfig(patch: any) {
    const newValuePatched = {
      ... this.config$.lastVal,
      ... patch
    }
    this.config$.next(newValuePatched)
    localStorage.setItem(ORYOL_CONFIG_KEY, JSON.stringify(newValuePatched))
  }
}
