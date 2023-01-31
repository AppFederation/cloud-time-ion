import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {createViewSyncerForField, ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {JournalEntry} from '../../models/JournalEntry'
import {TimelineListOptionsData} from '../journal-entries-list.page'
import {UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-timeline-list-options',
  templateUrl: './timeline-list-options.component.html',
  styleUrls: ['./timeline-list-options.component.sass'],
})
export class TimelineListOptionsComponent implements OnInit {

  @Required()
  @Input()
  listOptions$P ! : PatchableObservable<TimelineListOptionsData>


  formControl = new UntypedFormControl()

  viewSyncer ! : ViewSyncer
  formControls = { range: new UntypedFormControl() }


  constructor() { }

  ngOnInit() {
    this.viewSyncer = createViewSyncerForField(this.listOptions$P, 'sortAscending', this.formControl)

    this.formControls.range.valueChanges.subscribe(value => {
      console.log('value', value)
    })
  }

}
