import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from "../core/journal-entries.service";
import {JournalEntry, JournalEntryId} from "../models/JournalEntry";
import {debugLog} from "../../../libs/AppFedShared/utils/log";
import {ApfGeoLocationService} from "../../../libs/AppFedShared/geo-location/apf-geo-location.service";
import {JournalTextDescriptor, JournalTextDescriptors} from "../models/JournalTextDescriptors";
import {NumericPickerVal} from "../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component";
import {JournalNumericDescriptors} from '../models/JournalNumericDescriptors'
import {JournalEntry$} from '../models/JournalEntry$'
import {ActivatedRoute, Router} from '@angular/router'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-journal-write-page',
  templateUrl: './journal-write.page.html',
  styleUrls: ['./journal-write.page.sass'],
})
export class JournalWritePage implements OnInit {

  public item$ ? : JournalEntry$

  /** annoying coz covers part of the last text field */
  showFab = false

  public itemId: JournalEntryId = this.activatedRoute.snapshot.params['itemId']

  item$FakeArray ! : Array<JournalEntry$>

  constructor(
    public journalEntriesService: JournalEntriesService,
    public geoLocationService: ApfGeoLocationService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) {
    debugLog(`JournalWritePage constructor this.activatedRoute.snapshot.params['itemId']`, this.activatedRoute.snapshot.params)
  }

  ngOnInit() {
    debugLog(`JournalWritePage ngOnInit()`,
      `itemId`, this.itemId,
      `this.activatedRoute.snapshot.params['itemId']`, this.activatedRoute.snapshot.params)
    this.initItem();
  }

  public initItem() {
    if ( this.itemId === `new`) {
      // #UX: #Focus: having a special url for `new` entry could actually be good: when browser/page loads, we always start fresh, without getting distracted by what happened to be the previous entry
      // ... (which might be totally irrelevant and distracting now, since we want to write new entry and not make a retrospective
      this.newItem()
    } else {
      this.setItem$(this.journalEntriesService.obtainItem$ById(this.itemId))
    }
    // this.journalEntry.saveNowToDb()
  }

  private patch(patch: any) {
    patch.lastModifiedGeo =
      /* this should be interceptor (or at least smth in overwritten method in JournalEntry) outside of UI anyway */
      this.geoLocationService.geoLocation$.lastVal &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition.coords &&
      Object.assign({}, this.geoLocationService.geoLocation$.lastVal.currentPosition.coords)
    // .coords || null // FIXME: use on-save interceptor

    this.item$ ?. patchThrottled(patch)
  }

  newItem() {
    debugLog(`JournalWritePage newItem()`,
      `itemId`, this.itemId,
      `this.activatedRoute.snapshot.params['itemId']`, this.activatedRoute.snapshot.params)

    this.item$?.saveNowToDbIfNeeded()
    // this.item$Replacable
    this.router.navigateByUrl(`/journal/write/new`).then(() => {
      this.setItem$(new JournalEntry$(this.journalEntriesService, undefined, new JournalEntry()))
    })
  }

  private setItem$(item$: JournalEntry$) {
    this.item$ ?. saveNowToDbIfNeeded ?. ()
    this.item$ = item$
    this.item$FakeArray = [ this.item$ ]
  }
}
