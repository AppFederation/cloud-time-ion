import {Component, Input, OnInit} from '@angular/core';
import {JournalEntry$} from '../../../apps/Journal/models/JournalEntry$'
import {Observable} from 'rxjs/internal/Observable'

@Component({
  selector: 'app-journal-entry-list-item',
  templateUrl: './journal-entry-list-item.component.html',
  styleUrls: ['./journal-entry-list-item.component.sass'],
})
export class JournalEntryListItemComponent implements OnInit {

  @Input() item$ ! : JournalEntry$

  get itemVal$Any(): Observable<any> {
    return this.item$.val$ as Observable<any>
  }

  constructor() { }

  ngOnInit() {}

}
