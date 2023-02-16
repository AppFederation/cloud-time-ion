import {LearnItem$} from '../models/LearnItem$'
import {sortBy} from 'lodash-es'
import {SelectionManager} from './SelectionManager'
import {LocalOptionsPatchableObservable} from '../core/options.service'
import {ListOptionsData} from './list-options'
import {Injector} from '@angular/core'
import {NavigationService} from '../../../shared/navigation.service'
import {importanceDescriptors} from '../models/fields/importance.model'

export class ListProcessing {

  /** TODO: rename to searchStripped */
  search: string = ''

  selection = new SelectionManager()

  item$s: LearnItem$[] = []

  filteredItem$s: LearnItem$[] = []

  listOptions$P = new LocalOptionsPatchableObservable<ListOptionsData>({
      preset: `lastModified`
    }
  )

  navigationService = this.injector.get(NavigationService)

  constructor(
    protected injector: Injector,
  ) {
    this.listOptions$P.locallyVisibleChanges$.subscribe(options => {
      this.setItemsAndSort(this.item$s)
      this.reFilter()
    })
  }

  /** TODO: move to class ListProcessing
   *
   * ==== General:
   * - probably all sort criteria should always be listed (some of them grouped into e.g. ROI), just changing order,
   *   otherwise we leave ex-aequo resolution to chance (or defaulting to last-modified)
   *   - so maybe the presets should just be written based on how they differ from default (e.g. importance, fun (, ...defaults); fun, roi (, ...defaults))
   * */
  public setItemsAndSort(item$s: LearnItem$[]) {
    const urgencyGetterDescending = (item: LearnItem$) => {
      return item.val?.getEffectiveDeferrability()
      // return 0 /* TODO: importance / "calendar" time left to start/finish * time required to finish (including dependencies, sub-tasks) */
      // cannot-yet-start (via startAfter) could have negative urgency
    }
    // const durationGetter
    //   = (item: LearnItem) => item.getDurationEstimateMs() ?? 999_999_999
    const whenLastTouchedDescending
      = (item: LearnItem$) => - ((item.val?.whenLastModified ?? item.val?.whenAdded ?? item.val?.whenCreated)?.toMillis() ?? 0)
    const whenCreatedAscending
      = (item: LearnItem$) => (item.val?.whenAdded ?? item.val?.whenCreated)?.toMillis() ?? 0
    const deadlineAscending
      = (item: LearnItem$) => item.val?.getNearestDateForUrgency()?.getTime() ?? new Date(2099, 1,1).getTime()
    const maybeDoableGetterDescending
      = (item: LearnItem$) => ! item.val?.isMaybeDoableNow()
    const durationGetterAscending
      = (item: LearnItem$) => item.val?.getDurationEstimateMs() ?? 999_999_999
    const importanceGetterDescending
      = (item: LearnItem$) => - (item.val?.importance ?. numeric ?? -99999) /* TODO get descriptor by id later: getEffectiveImportance() */
    const funGetterDescending
      = (item: LearnItem$) => - (item.val?.funEstimate ?. numeric ?? -99999) /* TODO get descriptor by id later */
    const physicalHealthImpactGetterDescending
      = (item$: LearnItem$) => - (item$.getEffectivePhysicalHealthImpactNumeric() ?? -99999) /* TODO get descriptor by id later */
    const mentalHealthImpactGetterDescending
      = (item$: LearnItem$) => - (item$.getEffectiveMentalHealthImpactNumeric() ?? -99999) /* TODO get descriptor by id later */
    const mentalGetterAscending
      = (item: LearnItem$) => item.val?.mentalLevelEstimate?.numeric ?? 99999 /* TODO get descriptor by id later */
    const roiGetterDescending
      = (item: LearnItem$) => - (item.getEffectiveRoi() ?? -99999)
    // item$s = items.map(item => Object.assign(new LearnItem(), item))
    const listOptions = this.listOptions$P.locallyVisibleChanges$.lastVal
    // debugLog(`listOptions`, listOptions)
    const preset = listOptions ?. preset
    if ( preset === `lastModified` || preset === `allTasks` ) {
      // this.items = sortBy(items, field<LearnItem>(`whenAdded`)).reverse()
      this.item$s = sortBy(item$s, whenLastTouchedDescending)
    } else if ( preset === `whenCreated` ) {
      this.item$s = sortBy(item$s, [
        whenCreatedAscending,
      ])
    } else if ( preset === `nearest_deadlines` ) {
      this.item$s = sortBy(item$s, [
        deadlineAscending,
      ])
    } else if ( preset === `roi` ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        urgencyGetterDescending /* the ROI is in avoiding stress and complications by doing things ahead of time */,
        roiGetterDescending,
      ])
    } else if ( preset === `quickest` ) {
      this.item$s = sortBy(item$s,
        [
          maybeDoableGetterDescending,
          durationGetterAscending,
          /* TODO: here sort by duration *maximum* value in distribution, to avoid potential rabbit holes */
          roiGetterDescending,
        ]
      )
    } else if ( preset === `funQuickEasy` ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        funGetterDescending,
        durationGetterAscending /* NOT ROI here, coz we wanna prioritize fun and quick and easy; whereas roi would elevate importance */,
        mentalGetterAscending,
        importanceGetterDescending,
      ])
    } else if ( preset === `healthFunQuickEasy` ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        physicalHealthImpactGetterDescending,
        mentalHealthImpactGetterDescending,
        funGetterDescending,
        durationGetterAscending /* NOT ROI here, coz we wanna prioritize fun and quick and easy; whereas roi would elevate importance */,
        mentalGetterAscending,
        importanceGetterDescending,
      ])
    } else if ( preset === `importance_roi` /* === this is the DEFAULT */ ) {
      this.item$s = sortBy(item$s, [
        // maybeDoableGetterDescending,
        /* TODO: take into account nearest deadlines (start/finish before);
          * but bucket them by order of magnitude, taking into account estimated time
          * and within those buckets, sort by importance;
          * also deps to start, deps to finish */
        // urgencyGetterDescending,
        // importanceGetterDescending,
        /* TODO: take into account */
        roiGetterDescending /* for now here it is the same as if duration sort were at this position, but in future ROI might be more advanced.
          Take into account %done, for real remaining cost
        */,
        mentalGetterAscending /* kinda part of ROI */,
        funGetterDescending /* kinda part of ROI */,
      ])
    } else if ( preset === `funRoi` ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        funGetterDescending /* kinda part of ROI */,
        roiGetterDescending /* for now here it is the same as if duration sort were at this position, but in future ROI might be more advanced.
          Take into account %done, for real remaining cost
        */,
        mentalGetterAscending /* kinda part of ROI */,
        importanceGetterDescending,
      ])
    } else if ( preset === `funImportant` /*  importance -> ignoring ROI*/ ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        funGetterDescending,
        /* urgency maybe at second place; coz when user opts to choose fun, fun is the most urgent, probably, to relax */
        importanceGetterDescending,
        roiGetterDescending /* for now here it is the same as if duration sort were at this position, but in future ROI might be more advanced.
          Take into account %done, for real remaining cost
        */,
        mentalGetterAscending /* kinda part of ROI */,
      ])
    } else {
      this.item$s = sortBy(item$s, [
        importanceGetterDescending,
        funGetterDescending,
        durationGetterAscending
        /* TODO ROI*//*, /!*`whenModified`, *!/ `whenAdded`*/
      ])
    }
    // TODO: sort ascending by effectiveTimeEstimate

    this.reFilter() // FIXME: filter should go before sort, for performance
    // this.patchOwnersIfNecessary(user, items)
  }

  /** TODO: move to class ListProcessing ; can be just 1:1 for now */
  private reFilter() {
    const opts = this.listOptions$P.locallyVisibleChanges$.lastVal
    const preset = opts?.preset

    const items = this.item$s.filter(item => ! item.val?.whenDeleted)

    if (preset === `lastModified`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
      )
    } else if (preset === `whenCreated`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
      )
    } else if (preset === 'roi') {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
          && item.val?.time_estimate
      )
    } else if (preset === `allTasks`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
      )
    } else if (preset === `notEstimated`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
          && ! item.val?.getDurationEstimateMs()
      )
    } else if (preset === `estimated`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
          && item.val?.getDurationEstimateMs()
      )
    } else if (preset === `tasks_by_importance_roi`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
          && item.getEffectiveImportance()
          && item.getEffectiveRoi()
      )
    } else if (preset === `learn_items_by_importance`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isEffectivelyToLearn()
          && item.getEffectiveImportance()
      )
    } else {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
        // && item.importance
        // && item.funEstimate
      )
    }
    // console.log(`this.search`, this.search, !!this.search)
    this.filteredItem$s = [

      ... (!this.search?.trim() ? (this.filteredItem$s.filter( /* FIXME: don't include this if `searchText.trim()` */
        item$ => {
          const effectiveImportance = item$.getEffectiveImportance()
          // console.log(`effectiveImportance`, effectiveImportance)
          return effectiveImportance.numeric === importanceDescriptors.pinned.numeric
        }
      )) : []),
      ... this.filteredItem$s.filter(
        item =>
          item.val?.isMaybeDoableNow()
      )
    ]

    this.selection.setAllPossibleToSelect(this.filteredItem$s.map(item => item.id))
    this.navigationService.list = this.filteredItem$s
  }

  /** can be removed coz belongs in model class */
  matchesSearch(item$: LearnItem$) {
    // if ( item.hasQAndA() ) {
    //   return false
    // }
    // strip html: https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
    if ( ! item$?.val ) {
      return false
    }
    return item$.val?.matchesSearch(this.search)
  }

  onChangeSearch($event: string) {
    this.reFilter()
  }

}
