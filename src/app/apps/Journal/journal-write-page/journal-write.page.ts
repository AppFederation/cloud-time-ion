import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from "../journal-core/journal-entries.service";
import {JournalEntry} from "../journal-core/JournalEntry";
import {debugLog} from "../../../libs/AppFedShared/utils/log";
import {ApfGeoLocationService} from "../../../libs/AppFedShared/geo-location/apf-geo-location.service";

@Component({
  selector: 'app-journal-write-page',
  templateUrl: './journal-write.page.html',
  styleUrls: ['./journal-write.page.sass'],
})
export class JournalWritePage implements OnInit {

  public journalEntry: JournalEntry

  constructor(
    public journalEntriesService: JournalEntriesService,
    public geoLocationService: ApfGeoLocationService,
  ) { }

  ngOnInit() {
    this.newEntry();
  }

  private newEntry() {
    this.journalEntry = new JournalEntry(this.journalEntriesService, undefined, 'New Journal Entry ' + new Date().toISOString())
    this.journalEntry.saveNowToDb()
  }

  onChangeText($event: Event) {
    debugLog('onChangeText', $event)
    this.journalEntry.patchThrottled({
      text: $event.srcElement['value'] as unknown as string,
      lastModifiedGeo:
        this.geoLocationService.geoLocation$.lastVal &&
        this.geoLocationService.geoLocation$.lastVal.currentPosition &&
        this.geoLocationService.geoLocation$.lastVal.currentPosition.coords &&
        Object.assign({}, this.geoLocationService.geoLocation$.lastVal.currentPosition.coords)
      // .coords || null // FIXME: use on-save interceptor
    })
  }
}
