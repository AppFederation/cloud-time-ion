import {Component, HostListener, Injector, OnInit} from '@angular/core';
import {sortBy} from 'lodash-es'
import {LearnDoService} from '../core/learn-do.service'
import {field, HtmlString, LearnItem, LearnItemSidesVals} from '../models/LearnItem'
import {splitAndTrim} from '../../../libs/AppFedShared/utils/stringUtils'
import {AuthService} from '../../../auth/auth.service'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {UntypedFormControl} from '@angular/forms'
import {htmlToId, stripHtml} from '../../../libs/AppFedShared/utils/html-utils'
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'
import {LingueeService} from '../natural-langs/linguee.service'
import {MerriamWebsterDictService} from '../natural-langs/merriam-webster-dict.service'
import {PopoverController} from '@ionic/angular'
import {ListOptionsComponent} from './list-options/list-options.component'
import {ListOptions, ListOptionsData} from './list-options'
import {JournalEntriesService} from '../../Journal/core/journal-entries.service'
import {LocalOptionsPatchableObservable} from '../core/options.service'
import {isNullishOrEmptyOrBlank} from '../../../libs/AppFedShared/utils/utils'
import {Router} from '@angular/router'
import {importanceDescriptors, importanceDescriptorsArray} from '../models/fields/importance.model'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {LearnItem$} from '../models/LearnItem$'
import {SelectionManager} from './SelectionManager'
import {ListProcessing} from './list-processing'
import {BaseComponent} from '../../../libs/AppFedShared/base/base.component'

/** TODO: rename to smth simpler more standard like LearnDoItemsPage (search-or-add is kinda implied, especially search) */
@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.scss'],
})
export class SearchOrAddLearnableItemPageComponent extends BaseComponent implements OnInit {


  listModel = new ListProcessing(this.injector)

  htmlSearch ? : string = undefined

  searchFormControl = new UntypedFormControl()

  get filteredItem$s(): LearnItem$[] { return this.listModel.filteredItem$s }

  get item$s(): LearnItem$[] { return this.listModel.item$s }

  get authUserId() {
    return this.authService.authUser$.lastVal?.uid
  }

  constructor(
    public learnDoService: LearnDoService,
    public journalEntriesService: JournalEntriesService,
    public authService: AuthService,
    public lingueeService: LingueeService,
    public merriamWebsterDictService: MerriamWebsterDictService,
    public popoverController: PopoverController,
    public router: Router,
    public injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {
    this.searchFormControl.valueChanges.pipe(
      debounceTime(/*100*/300) /* FIXME: this debounceTime() is probably causing the double-adding of items */,
      // tap(debugLog),
      // map(stripHtml), // TODO but need to not destroy html
      // TODO: strip too coz maybe adding a space should not make a difference
      distinctUntilChanged(),
    ).subscribe(val => {
      this.htmlSearch = val // !! FIXME BUG: this is debounced; BUG when pressing enter/alt+enter fast - old value is taken
      val = stripHtml(val)

      this.listModel.search = val
      this.listModel.onChangeSearch(val)
    })
    this.learnDoService.localItems$.subscribe((item$s: LearnItem$[]) => {
      // console.log('localItems$ ==== '/*, item$s*/)
      this.listModel.setItemsAndSort(item$s)
    })
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

  private getUserString(string?: string): string {
    // return string ?? this.htmlSearch ?? this.listModel.search ?? ``
    return string ?? this.searchFormControl.value ?? this.listModel.search ?? ``
    // FIXME: this inconsistency with clearInput might be causing the bug with double-adding of items
  }

  clearInput() {
    this.listModel.search = ''
    this.htmlSearch = ''
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
    return Object.assign(new LearnItem(), {
      owner: this.authUserId,
      whenAdded: new Date(),
      isTask: isTask ? true : null,
      ...overlay,
    })
  }

  private applyImportanceFromText(stringEviscerated: string | nullish, overlay: Partial<LearnItemSidesVals & LearnItem>) {
  // private applyImportanceFromText(stringEviscerated: string | nullish, overlay: Partial<LearnItemSidesVals & LearnItem>) {
    //   const s = stringEviscerated?.toUpperCase()
    //   const importanceDescriptors = importanceDescriptorsArray
    //   //   {
    //   //   current_focus: "CF",
    //   //   basic_functioning: "BF",
    //   //   basic_functioning_mantra: "BFMTR",
    //   //   overarching_mantra: "OVRMTR",
    //   //   overarching: "OVR",
    //   //   current_focus_meta_mantra: "CFMM, CFMTM, CFMTMTR, CFMETAMANTRA",
    //   //   current_focus_mantra: "CFM, CFMT, CFMTR, CFMANTRA",
    //   //   meta_mantra: "!!!!!",
    //   //   mantra: "!!!!!",
    //   //   meta: "!!!!!",
    //   //   extremely_high: "!!!!",
    //   //   very_high: "!!!",
    //   //   high: "!!",
    //   //   somewhat_high: "!"
    //   // };
    //   const keys = Object.keys(importanceDescriptors);
    //   for (let i = 0; i < keys.length; i++) {
    //     if (s?.startsWith(keys[i]) || s?.endsWith(keys[i])) {
    //       overlay.importance = importanceDescriptors[keys[i]];
    //       break;
    //     }
    //   }
    // }



    const s = stringEviscerated?.toUpperCase()
    /*==*/ if (s?.startsWith(`CF!`) || s?.endsWith(`CF!`)) {
      overlay.importance = importanceDescriptors.current_focus
    } else if (s?.startsWith(`BF!`) || s?.endsWith(`BF!`)
        || s?.startsWith(`BF !`) || s?.endsWith(`BF !`)
    ) {
      overlay.importance = importanceDescriptors.basic_functioning
    } else if (s?.startsWith(`BFMTR!`) || s?.endsWith(`BFMTR!`)
        || s?.startsWith(`BFMTR !`) || s?.endsWith(`BFMTR !`)
    ) {
      overlay.importance = importanceDescriptors.basic_functioning_mantra
    } else if (s?.startsWith(`CFMTR!`) || s?.endsWith(`CFMTR!`)
        || s?.startsWith(`CFMTR !`) || s?.endsWith(`CFMTR !`)
    ) {
      overlay.importance = importanceDescriptors.basic_functioning_mantra
    } else if (s?.startsWith(`OVRMTR!`) || s?.endsWith(`OVRMTR!`)) {
      overlay.importance = importanceDescriptors.overarching_mantra
    } else if (s?.startsWith(`OVR!`) || s?.endsWith(`OVR!`)) {
      overlay.importance = importanceDescriptors.overarching
    } else if (s?.startsWith(`CFMM!`) || s?.endsWith(`CFMM!`)
        || s?.startsWith(`CFMTM!`) || s?.endsWith(`CFMTM!`)
        || s?.startsWith(`CFMTMTR!`) || s?.endsWith(`CFMTMTR!`)
        || s?.startsWith(`CFMETAMANTRA!`) || s?.endsWith(`CFMETAMANTRA!`)
    ) {
      overlay.importance = importanceDescriptors.current_focus_meta_mantra
    } else if (s?.startsWith(`CFM!`) || s?.endsWith(`CFM!`)
        || s?.startsWith(`CFMT!`) || s?.endsWith(`CFMT!`)
        || s?.startsWith(`CFMTR!`) || s?.endsWith(`CFMTR!`)
        || s?.startsWith(`CFMANTRA!`) || s?.endsWith(`CFMANTRA!`)
    ) {
      overlay.importance = importanceDescriptors.current_focus_mantra
    } else if (s?.startsWith(`!!!!!!!`) || s?.endsWith(`!!!!!!!`)) {
      overlay.importance = importanceDescriptors.meta_mantra
    } else if (s?.startsWith(`!!!!!!`) || s?.endsWith(`!!!!!!`)) {
      overlay.importance = importanceDescriptors.mantra
    } else if (s?.startsWith(`!!!!!`) || s?.endsWith(`!!!!!`)) {
      overlay.importance = importanceDescriptors.meta
    } else if (s?.startsWith(`!!!!`) || s?.endsWith(`!!!!`)) {
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

  hasSearchText() {
    return !! this.listModel.search?.trim();
  }

  async onClickListOptions(event: any) {
    const popover = await this.popoverController.create({
      component: ListOptionsComponent,
      componentProps: {
        listOptions$P: this.listModel.listOptions$P
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: `my-popover`,
      // size: 'cover',
      // side: 'left',
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
