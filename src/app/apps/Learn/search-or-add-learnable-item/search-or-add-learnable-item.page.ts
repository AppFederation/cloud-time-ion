import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
// import sortBy from 'lodash/sortBy'
import {sortBy} from 'lodash-es'
// import countBy from 'lodash/countBy'
import {LearnDoService} from '../core/learn-do.service'
import {field, LearnItem, LearnItemSidesVals} from '../models/LearnItem'
import {splitAndTrim} from '../../../libs/AppFedShared/utils/stringUtils'
import {AuthService} from '../../../auth/auth.service'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {FormControl} from '@angular/forms'
import {debounceTime, distinct, distinctUntilChanged, map, tap, throttleTime} from 'rxjs/operators'
import {htmlToId, stripHtml} from '../../../libs/AppFedShared/utils/html-utils'
import {LingueeService} from '../natural-langs/linguee.service'
import {MerriamWebsterDictService} from '../natural-langs/merriam-webster-dict.service'
import {PopoverController} from '@ionic/angular'
import {ListOptionsComponent} from './list-options/list-options.component'
import {ListOptions, ListOptionsData} from './list-options'
import {JournalEntriesService} from '../../Journal/core/journal-entries.service'
import {LocalOptionsPatchableObservable, OptionsService} from '../core/options.service'
import {DataGeneratorService} from '../../../generators/data-generator.service'
import {async} from 'rxjs/internal/scheduler/async'
import {isNullishOrEmptyOrBlank} from '../../../libs/AppFedShared/utils/utils'
import {Data, Router} from '@angular/router'
import {SelectionManager} from './SelectionManager'
import {importanceDescriptors} from '../models/fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../models/LearnItem$'
import {SelectionManager} from './SelectionManager'

/** TODO: rename to smth simpler more standard like LearnDoItemsPage (search-or-add is kinda implied, especially search) */
@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.scss'],
})
export class SearchOrAddLearnableItemPageComponent implements OnInit {

  listOptions?: ListOptions

  listOptions$P = new LocalOptionsPatchableObservable<ListOptionsData>({
      preset: `lastModified`
    }
  )

  /** TODO: rename to searchStripped */
  search: string = ''
  htmlSearch ? : string = undefined
  searchFormControl = new FormControl()

  coll ! : AngularFirestoreCollection<any>

  item$s: LearnItem$[] = []

  filteredItem$s: LearnItem$[] = []

  private patchingOwnerHasRun = false

  showOldEditor = false

  selection = new SelectionManager()


  get authUserId() {
    return this.authService.authUser$.lastVal?.uid
  }

  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
    protected learnDoService: LearnDoService,
    protected journalEntriesService: JournalEntriesService,
    protected dataGeneratorService: DataGeneratorService,
    protected optionsService: OptionsService,
    public authService: AuthService,
    public lingueeService: LingueeService,
    public merriamWebsterDictService: MerriamWebsterDictService,
    public popoverController: PopoverController,
    public router: Router,
  ) {
    this.listOptions$P.locallyVisibleChanges$.subscribe(options => {
      this.setItemsAndSort(this.item$s)
      this.reFilter()
    })
  }

  ngOnInit() {
    this.searchFormControl.valueChanges.pipe(
      // debounceTime(1000),
      throttleTime(200, async, { leading: false, trailing: true}),
      // tap(debugLog),
      // map(stripHtml), // TODO but need to not destroy html
      // TODO: strip too coz maybe adding a space should not make a difference
      distinctUntilChanged(),
    ).subscribe(val => {
      this.htmlSearch = val
      val = stripHtml(val)

      this.search = val
      this.onChangeSearch(val)
    })

    this.optionsService.generatedData$.subscribe(isGeneratedDataSelected => {
      if (isGeneratedDataSelected) {
        this.setItemsAndSort(this.dataGeneratorService.generateLearnItemList(3000))
      } else {
        this.learnDoService.localItems$.subscribe(item$s => {
          this.setItemsAndSort(item$s)
        })
      }
    })
  }

  /** TODO: move to class ListProcessing
   *
   * ==== General:
   * - probably all sort criteria should always be listed (some of them grouped into e.g. ROI), just changing order,
   *   otherwise we leave ex-aequo resolution to chance (or defaulting to last-modified)
   *   - so maybe the presets should just be written based on how they differ from default (e.g. importance, fun (, ...defaults); fun, roi (, ...defaults))
   * */
  private setItemsAndSort(item$s: LearnItem$[]) {
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
    const mentalGetterAscending
      = (item: LearnItem$) => item.val?.mentalLevelEstimate?.numeric ?? 99999 /* TODO get descriptor by id later */
    const roiGetterDescending
      = (item: LearnItem$) => - (item.val?.getRoi() ?? -99999)
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
    } else if ( preset === `importance_roi` /* === this is the DEFAULT */ ) {
      this.item$s = sortBy(item$s, [
        maybeDoableGetterDescending,
        /* TODO: take into account nearest deadlines (start/finish before);
          * but bucket them by order of magnitude, taking into account estimated time
          * and within those buckets, sort by importance;
          * also deps to start, deps to finish */
        urgencyGetterDescending,
        importanceGetterDescending,
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

  add(string?: string, isTask?: boolean, navInto?: boolean) {
    console.log('add: ', string)

    if ( this.isTextEmpty() ) {
      const val = new LearnItem()
      val.isTask = !! isTask
      const learnItem$ = this.learnDoService.add(val)
      this.navigateIntoItem(learnItem$.id !)
      return
    }
    string = this.getUserString(string)
    // if ( !string ) {
    //   return // FIXME: allow creating empty --> ?? ``
    // }
    //
    // if (! (string || '').trim().length ) {
    //   return // FIXME: allow creating empty
    // }

    const newItem = this.createItemFromInputString(string, isTask)
    if ( newItem ) {
      debugLog(`add item:`, newItem)
      const item$ = this.learnDoService.add(newItem as any as LearnItem)
      // this.syncStatusService.handleSavingPromise(
      //   this.coll.add(newItem) /* This will go away when migrated to ODM */ )
      this.clearInput()
      if ( navInto ) {
        this.navigateIntoItem(item$.id !)
      }
    }
  }

  private navigateIntoItem(id: string) {
    this.router.navigateByUrl('learn/item/' + id)
  }

  private getUserString(string?: string) {
    return string ?? this.htmlSearch ?? this.search ?? ``
  }

  clearInput() {
    this.search = ''
    this.searchFormControl.setValue('')
  }

  /** maybe this could be moved to model class ---> actually service */
  createItemFromInputString(string: string, isTask?: boolean) {
    const stringEviscerated = stripHtml(string)?.trim()
    // if ( ! string ?. trim() ) {
    //   return
    // }
    const QQ = /<-->|<->|----/ // <> - pascal not-equal
    const QA = /---/ // |-->/ // removed -- because it exists in command line options and html comments
    // --> - end of XML/HTML comment
    const overlay: Partial<LearnItemSidesVals & LearnItem> = {}
    if ( string.match(QQ) ) {
      const split = splitAndTrim(string, QQ)
      debugLog(`splitAndTrim`, split)
      overlay.question = split[0]
      overlay.question2 = split[1]
      if ( split[2] ) {
        overlay.question3 = split[2]
      }
    } else if ( string.match(QA) ) {
      // something here is causing leading empty paragraph:
      // <p> </p>
      // <p>aaa</p>
      const split = splitAndTrim(string, QA)
      overlay.question = split[0]
      overlay.answer = split[1]
      if ( split[2] ) {
        overlay.question2 = split[2]
      }
      if ( split[3] ) {
        overlay.question3 = split[3]
      }
    } else {
      overlay.title = (string ?? '')./*?.*/trim() /*?? null*/
    }
    this.applyImportanceFromText(stringEviscerated, overlay)
    return {
      owner: this.authUserId,
      whenAdded: new Date(),
      isTask: isTask ? true : null,
      ...overlay,
    }
  }

  private applyImportanceFromText(stringEviscerated: string | nullish, overlay: Partial<LearnItemSidesVals & LearnItem>) {
    const s = stringEviscerated
    /*==*/ if (s?.startsWith(`!!!!`) || s?.endsWith(`!!!!`)) {
      overlay.importance = importanceDescriptors.extremely_high
    } else if (s?.startsWith(`!!!`) || s?.endsWith(`!!!`)) {
      overlay.importance = importanceDescriptors.very_high
    } else if (s?.startsWith(`!!`) || s?.endsWith(`!!`)) {
      overlay.importance = importanceDescriptors.high
    } else if (s?.startsWith(`!`) || s?.endsWith(`!`)) {
      overlay.importance = importanceDescriptors.somewhat_high
    }
  }

  addTask(navInto?: boolean) {
    this.add(undefined, true, navInto)
  }

  addToLearn(navInto?: boolean) {
    // this.lingueeService.doIt(this.search).then()
    // this.merriamWebsterDictService.doIt(this.search)

    this.add(undefined, false, navInto)
  }

  @HostListener('window:keyup.alt.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(`alt enter`)
  }

  trackByFn(index: number, item: LearnItem) {
    return item.id
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

  /** TODO: move to class ListProcessing ; can be just 1:1 for now */
  private reFilter() {
    console.log(`Refiltering list`);
    const opts = this.listOptions$P.locallyVisibleChanges$.lastVal
    const preset = opts?.preset

    const items = this.item$s.filter(item => ! item.val?.whenDeleted)

    if (preset === `lastModified`) {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
      )
    } if (preset === `whenCreated`) {
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
    } else {
      this.filteredItem$s = items.filter(
        item =>
          this.matchesSearch(item)
          && item.val?.isTask
          // && item.importance
          // && item.funEstimate
      )
    }
    this.selection.setAllPossibleToSelect(this.filteredItem$s.map(item => item.id))
  }

  hasSearchText() {
    return !! this.search?.trim();
  }

  async onClickListOptions(event: any) {
    const popover = await this.popoverController.create({
      component: ListOptionsComponent,
      componentProps: {
        listOptions$P: this.listOptions$P
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: `my-popover`,
    });
    return await popover.present();
  }

  addToJournal() {
    // TODO: if empty, go to journal entry details page
    this.journalEntriesService.add(this.getUserString())
    this.clearInput()
  }

  isTextEmpty() {
    return isNullishOrEmptyOrBlank(this.getUserString())
  }
}
