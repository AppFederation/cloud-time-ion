import { Injectable } from '@angular/core';
import {g} from './g'

/** showAll */
export var enableAll = false

export class FeatureLevelsConfig {
  // ORDER: from least mature to most

  showDeprecated = enableAll

  showTodosNotes = enableAll


  /** mockups (/notes?) of stuff that I will prolly not be able/willing to do, unless i become like Musk ;). Still kinda motivating to push harder upon seeing this. */
  megalomania = enableAll


  /** stuff that is not implemented, just visual for imagination / motivation / visualization */
  mockups = enableAll

  /** stuff that works or gives some everyday value but looks ugly/unprofessional/unfinished */
  showUgly = enableAll

  /** an entire feature/page/sub-product could be unfinished; or just its feature/sub-feature */
  unfinished = enableAll

  /** might be unstable for me or end user */
  showUnstable = enableAll

  /** Prolly stable for me but might be hard to understand for end user */
  showExperimental = enableAll

  /** works decently for me, e.g. text filter on categories in quiz */
  quickNDirty = enableAll


  /** worse than unpolished */
  buggy = enableAll

  /** better than `ugly`; works and fulfills some function, e.g. energy graph; actually worse than ugly; coz deficiencies not only in looks, but also in functionality
   * TODO split: into visual / func
   * */
  unpolished = enableAll // buggy?

  unpolishedFunctionality  = enableAll

  unpolishedVisually = enableAll

  // confusing

  // TODO/idea: alpha, beta, release-candidate


  showDebugPerformanceTracking = enableAll

  /** This is becoming similar to logger levels and logger tree */
  showDebug = enableAll

  showAdvanced = enableAll

  distracting = enableAll

  stressful = enableAll // also: depressing overwhelming, over-the-top (e.g. having 3000 quiz items pending) :)

  annoying = enableAll


  /** CROSS_CUTTING feature;
   * kinda stressful distracting annoying; timer time tracking current user activity */
  userActivityTiming = enableAll

  /** CROSS_CUTTING feature;
   e.g. on quiz / mindfulness */
  userActivityCountDownTimer = enableAll

  /** just an idea; more high priority than todos/notes/ideas texts display; should fix before release to end-users;
   * Can disable for demos. Should prolly be last in order of maturity, to force fixing fixmes before release. */
  showFixmes = enableAll

}


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  g = g

  feat: FeatureLevelsConfig = this.g.feat

  constructor() { }
}
