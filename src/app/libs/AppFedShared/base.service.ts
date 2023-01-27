import { Injectable } from '@angular/core';
import {g} from './g'

export class FeatureLevelsConfig {
  // ORDER: from least mature to most

  showDeprecated = false

  showTodosNotes = false


  /** mockups (/notes?) of stuff that I will prolly not be able/willing to do, unless i become like Musk ;). Still kinda motivating to push harder upon seeing this. */
  megalomania = false


  /** stuff that is not implemented, just visual for imagination / motivation / visualization */
  mockups = false

  /** stuff that works or gives some everyday value but looks ugly/unprofessional/unfinished */
  showUgly = false

  /** an entire feature/page/sub-product could be unfinished; or just its feature/sub-feature */
  unfinished = false

  /** might be unstable for me or end user */
  showUnstable = false

  /** Prolly stable for me but might be hard to understand for end user */
  showExperimental = false

  /** better than `ugly`; works and fulfills some function, e.g. energy graph; actually worse than ugly; coz deficiencies not only in looks, but also in functionality
   * TODO split: into visual / func
   * */
  unpolished = false

  unpolishedFunctionality  = false

  unpolishedVisually = false

  // TODO/idea: alpha, beta, release-candidate

  /** experimental / advanced */


  showPerformanceTracking = false

  /** This is becoming similar to logger levels and logger tree */
  showDebug = false

  showAdvanced = false

  /** just an idea; more high priority than todos/notes/ideas texts display; should fix before release to end-users;
   * Can disable for demos. Should prolly be last in order of maturity, to force fixing fixmes before release. */
  showFixmes = false

}


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  g = g

  feat: FeatureLevelsConfig = this.g.feat

  constructor() { }
}
