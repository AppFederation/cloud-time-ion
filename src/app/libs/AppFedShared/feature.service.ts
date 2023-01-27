import { Injectable } from '@angular/core';
import {g} from './g'
import {FeatureLevelsConfig, FeaturesProps} from './base.service'
import {CachedSubject} from './utils/cachedSubject2/CachedSubject2'

export let showWhatIUse = true

export class FeaturesConfig extends FeatureLevelsConfig {


  constructor(
    public props: FeaturesProps
  ) {
    super(props)
  }


  // IDEA for UI - shift+click or long press would select/unselect range from last clicked

  // this is really 2 dimensions - levels, features/sub-products; maybe also pages; could also have the API like that: `feat.journal.ugly`


  // === mock/prototype-only:


  shopping = this.fc(this.props)

  cloudTime = this.fc(this.props)

  notes = this.fc(this.props)

  /** OrYoL / Coviob style outliner notes with tree nodes */
  outlinerTreeNotes = this.fc(this.props)

  itemsTree = this.fc(this.props)

  // experimental:
  categoriesTree = this.fc(this.props)

  // ==== kinda working:

  tutorial = this.fc(this.props)

  lifedvisor = showWhatIUse

  journal = showWhatIUse

  tasks = showWhatIUse

  roiPoints = this.fc(this.props)

  /** prolly about more long-term planning/estimating than plan-today */
  planning = this.fc(this.props)


  /** estimates / milestones */
  estimating = showWhatIUse

  milestones = this.fc(this.props)

  planToday = this.fc(this.props)

  /** also keywords: plan execution service */
  timeTracking = this.fc(this.props)

  /** logging of time tracked periods */
  timeTrackingPeriods = this.fc(this.props)
  //   {
  //   periods: {
  //     /* this is only a placeholder for good future-proofness top-down usage patterns; total implementation of tree will be quite complicated in logic and UI */
  //     showFixmes: false
  //   }
  // }

  /** most mature prolly */
  learning = true

  quiz = this.fc(this.props)

  private fc(props: FeaturesProps) {
    return new FeatureLevelsConfig(props)
  }
}

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  config$ = new CachedSubject<FeaturesConfig>()

  constructor() {
    console.log('FeatureService ctor')
    // g.feat = this // DX FTW!
    const featuresConfig = new FeaturesConfig(
      {
        enableAll: false
      }
    )
    g.feat = featuresConfig
    this.config$.nextWithCache(featuresConfig)
  }

  setEnableAll(enabled: boolean) {
    console.log('FeaturesConfig setEnableAll', enabled)
    const featuresConfig1 = new FeaturesConfig(
      {
        enableAll: enabled
      }
    )
    g.feat = featuresConfig1
    this.config$.nextWithCache(featuresConfig1)
  }
}
