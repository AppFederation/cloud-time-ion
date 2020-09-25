import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from "../core/journal-entries.service";
import {JournalEntry, JournalEntryId} from "../models/JournalEntry";
import {debugLog} from "../../../libs/AppFedShared/utils/log";
import {ApfGeoLocationService} from "../../../libs/AppFedShared/geo-location/apf-geo-location.service";
import {JournalTextDescriptor, JournalTextDescriptors} from "../models/JournalTextDescriptors";
import {NumericPickerVal} from "../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component";
import {JournalNumericDescriptors} from '../models/JournalNumericDescriptors'
import {JournalEntry$} from '../models/JournalEntry$'
import {ActivatedRoute} from '@angular/router'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-journal-write-page',
  templateUrl: './journal-write.page.html',
  styleUrls: ['./journal-write.page.sass'],
})
export class JournalWritePage implements OnInit {

  public item$ ! : JournalEntry$

  fieldDescriptors = JournalNumericDescriptors.instance.array

  /** annoying coz covers part of the last text field */
  showFab = false

  public itemId: JournalEntryId = this.activatedRoute.snapshot.params['itemId']

  get itemVal$(): CachedSubject<JournalEntry | undefined | null> {
    return this.item$.val$
  }

  constructor(
    public journalEntriesService: JournalEntriesService,
    public geoLocationService: ApfGeoLocationService,
    public activatedRoute: ActivatedRoute,
  ) {
    debugLog(`this.activatedRoute.snapshot.params['itemId']`, this.activatedRoute.snapshot.params)
  }

  ngOnInit() {
    this.newEntry();
  }

  public newEntry() {
    if ( this.itemId === `new`) {
      this.item$ = new JournalEntry$(this.journalEntriesService, undefined, {})

    } else {
      this.item$ = this.journalEntriesService.getItem$ById(this.itemId)
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

    this.item$.patchThrottled(patch)
  }
}
