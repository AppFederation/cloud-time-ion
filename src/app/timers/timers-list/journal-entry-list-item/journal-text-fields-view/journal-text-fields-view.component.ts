import {Component, Input, OnInit} from '@angular/core';
import {JournalEntry$} from '../../../../apps/Journal/models/JournalEntry$'
import {JournalTextDescriptors} from '../../../../apps/Journal/models/JournalTextDescriptors'
import {Observable} from 'rxjs/internal/Observable'
import {CachedSubject} from '../../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {JournalEntry} from '../../../../apps/Journal/models/JournalEntry'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'

@Component({
  selector: 'app-journal-text-fields-view',
  templateUrl: './journal-text-fields-view.component.html',
  styleUrls: ['./journal-text-fields-view.component.sass'],
})
export class JournalTextFieldsViewComponent implements OnInit {

  textDescriptors = JournalTextDescriptors.instance.array

  @Input() item$ ! : JournalEntry$

  get itemVal$(): CachedSubject<JournalEntry | nullish> {
    return this.item$.val$
  }

  constructor() { }

  ngOnInit() {}

}