import {Component, Injector, Input, OnInit} from '@angular/core';
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {JournalEntry} from '../../models/JournalEntry'
import {JournalEntry$} from '../../models/JournalEntry$'
import {JournalNumericDescriptors} from '../../models/JournalNumericDescriptors'
import {BaseComponent} from '../../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-journal-item-edit',
  templateUrl: './journal-item-edit.component.html',
  styleUrls: ['./journal-item-edit.component.sass'],
})
export class JournalItemEditComponent extends BaseComponent implements OnInit {

  fieldDescriptors = JournalNumericDescriptors.instance.array

  @Input()
  public item$P ! : JournalEntry$

  get itemVal$(): CachedSubject<JournalEntry | undefined | null> {
    return this.item$P.val$
  }

  constructor(
    public injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {}

}
