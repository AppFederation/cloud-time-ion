import { Injectable } from '@angular/core';
import {g} from './g'
import {FeatureLevelsConfig} from './base.service'

export let showWhatIUse = true

@Injectable({
  providedIn: 'root'
})
export class FeatureService extends FeatureLevelsConfig /* HACK for now */ {

  // IDEA for UI - shift+click or long press would select/unselect range from last clicked

  // this is really 2 dimensions - levels, features/sub-products; maybe also pages; could also have the API like that: `feat.journal.ugly`


  // === mock/prototype-only:


  shopping = new FeatureLevelsConfig()

  cloudTime = new FeatureLevelsConfig()

  notes = new FeatureLevelsConfig()

  /** OrYoL / Coviob style outliner notes with tree nodes */
  outlinerTreeNotes = new FeatureLevelsConfig()

  itemsTree = new FeatureLevelsConfig()

  // experimental:
  categoriesTree = new FeatureLevelsConfig()

  // ==== kinda working:

  tutorial = new FeatureLevelsConfig()

  lifedvisor = showWhatIUse

  journal = showWhatIUse

  tasks = showWhatIUse

  roiPoints = new FeatureLevelsConfig()

  /** prolly about more long-term planning/estimating than plan-today */
  planning = new FeatureLevelsConfig()


  /** estimates / milestones */
  estimating = showWhatIUse

  milestones = new FeatureLevelsConfig()

  planToday = new FeatureLevelsConfig()

  /** also keywords: plan execution service */
  timeTracking = {
    periods: {
      /* this is only a placeholder for good future-proofness top-down usage patterns; total implementation of tree will be quite complicated in logic and UI */
      showFixmes: false
    }
  }

  /** most mature prolly */
  learning = true

  quiz = new FeatureLevelsConfig()


  constructor() {
    super()
    console.log('FeatureService ctor')
    g.feat = this // DX FTW!
  }
}
