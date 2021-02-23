import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {createViewSyncerForField, ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {JournalEntry} from '../../models/JournalEntry'
import {TimelineListOptionsData} from '../journal-entries-list.page'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-timeline-list-options',
  templateUrl: './timeline-list-options.component.html',
  styleUrls: ['./timeline-list-options.component.sass'],
})
export class TimelineListOptionsComponent implements OnInit {

  @Required()
  @Input()
  listOptions$P ! : PatchableObservable<TimelineListOptionsData>


  formControl = new FormControl()

  viewSyncer ! : ViewSyncer
  formControls = { range: new FormControl()}


  constructor() { }

  ngOnInit() {
    this.viewSyncer = createViewSyncerForField(this.listOptions$P, 'sortAscending', this.formControl)

    this.formControls.range.valueChanges.subscribe(value => {
      console.log('value', value)
    })
  }

}
