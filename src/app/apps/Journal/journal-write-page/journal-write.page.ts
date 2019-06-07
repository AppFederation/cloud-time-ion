import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from "../journal-core/journal-entries.service";
import {JournalEntry} from "../journal-core/JournalEntry";
import {debugLog} from "../../../libs/AppFedShared/utils/log";
import {ApfGeoLocationService} from "../../../libs/AppFedShared/geo-location/apf-geo-location.service";
import {JournalTextDescriptor, JournalTextDescriptors} from "../journal-models/JournalTextDescriptors";
import {Mood} from "./mood-picker/mood-picker.component";

@Component({
  selector: 'app-journal-write-page',
  templateUrl: './journal-write.page.html',
  styleUrls: ['./journal-write.page.sass'],
})
export class JournalWritePage implements OnInit {

  public journalEntry: JournalEntry
  textDescriptors = JournalTextDescriptors.array

  constructor(
    public journalEntriesService: JournalEntriesService,
    public geoLocationService: ApfGeoLocationService,
  ) { }

  ngOnInit() {
    this.newEntry();
  }

  private newEntry() {
    this.journalEntry = new JournalEntry(this.journalEntriesService, undefined)
    this.journalEntry.saveNowToDb()
  }

  /** TODO: user reactive forms with ODM wrapper for listening to diffs */
  onChangeText($event: Event, textDesc: JournalTextDescriptor) {
    const value = $event.srcElement['value'];
    debugLog('onChangeText', value, $event)
    const patch = {};
    patch[textDesc.id] = value as unknown as string
    this.patch(patch)
  }

  onChangeMood(mood: Mood) {
    debugLog('onChangeMood', mood)
    const patch = {
      mood: mood
    };
    this.patch(patch)
  }

  private patch(patch) {
    patch.lastModifiedGeo =
      this.geoLocationService.geoLocation$.lastVal &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition &&
      this.geoLocationService.geoLocation$.lastVal.currentPosition.coords &&
      Object.assign({}, this.geoLocationService.geoLocation$.lastVal.currentPosition.coords)
    // .coords || null // FIXME: use on-save interceptor

    this.journalEntry.patchThrottled(patch)
  }
}
