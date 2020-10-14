import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {JournalEntry$} from '../../../../apps/Journal/models/JournalEntry$'
import {JournalNumericDescriptors} from '../../../../apps/Journal/models/JournalNumericDescriptors'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {JournalEntry} from '../../../../apps/Journal/models/JournalEntry'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-journal-num-fields-view',
  templateUrl: './journal-num-fields-view.component.html',
  styleUrls: ['./journal-num-fields-view.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalNumFieldsViewComponent implements OnInit {

  // numDescriptors = [ JournalNumericDescriptors.instance.array [0] ]
  numDescriptors = JournalNumericDescriptors.instance.array

  @Input() item$ ! : JournalEntry$

  get val$(): CachedSubject<JournalEntry | nullish> {
    return this.item$.val$
  }

  constructor() { }

  ngOnInit() {}

}
