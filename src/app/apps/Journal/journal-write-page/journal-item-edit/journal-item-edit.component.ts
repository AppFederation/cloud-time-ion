import {Component, Input, OnInit} from '@angular/core';
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {JournalEntry} from '../../models/JournalEntry'
import {JournalEntry$} from '../../models/JournalEntry$'
import {JournalNumericDescriptors} from '../../models/JournalNumericDescriptors'

@Component({
  selector: 'app-journal-item-edit',
  templateUrl: './journal-item-edit.component.html',
  styleUrls: ['./journal-item-edit.component.sass'],
})
export class JournalItemEditComponent implements OnInit {

  fieldDescriptors = JournalNumericDescriptors.instance.array

  @Input()
  public item$P ! : JournalEntry$

  get itemVal$(): CachedSubject<JournalEntry | undefined | null> {
    return this.item$P.val$
  }

  constructor() { }

  ngOnInit() {}

}
