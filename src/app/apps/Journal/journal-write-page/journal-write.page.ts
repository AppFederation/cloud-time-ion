import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from "../core/journal-entries.service";
import {JournalEntry} from "../models/JournalEntry";
import {debugLog} from "../../../libs/AppFedShared/utils/log";
import {ApfGeoLocationService} from "../../../libs/AppFedShared/geo-location/apf-geo-location.service";
import {JournalTextDescriptor, JournalTextDescriptors} from "../models/JournalTextDescriptors";
import {NumericPickerVal} from "../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component";
import {JournalNumericDescriptors} from '../models/JournalNumericDescriptors'

@Component({
  selector: 'app-journal-write-page',
  templateUrl: './journal-write.page.html',
  styleUrls: ['./journal-write.page.sass'],
})
export class JournalWritePage implements OnInit {

  public journalEntry: JournalEntry

  fieldDescriptors = JournalNumericDescriptors.instance.array

  /** annoying coz covers part of the last text field */
  showFab = false

  constructor(
    public journalEntriesService: JournalEntriesService,
    public geoLocationService: ApfGeoLocationService,
  ) { }

  ngOnInit() {
    this.newEntry();
  }

  public newEntry() {
    this.journalEntry = new JournalEntry(this.journalEntriesService, undefined)
    // this.journalEntry.saveNowToDb()
  }

  private patch(patch) {
    patch.lastModifiedGeo =
      /* this should be interceptor (or at least smth in overwritten method in JournalEntry) outside of UI anyway */
      this.geoLocationService.geoLocation$.lastVal &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition.coords &&
      Object.assign({}, this.geoLocationService.geoLocation$.lastVal.currentPosition.coords)
    // .coords || null // FIXME: use on-save interceptor

    this.journalEntry.patchThrottled(patch)
  }
}
