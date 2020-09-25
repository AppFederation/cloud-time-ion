import {Component, Input, OnInit} from '@angular/core';
import {JournalEntry$} from '../../../apps/Journal/models/JournalEntry$'

@Component({
  selector: 'app-journal-entry-list-item',
  templateUrl: './journal-entry-list-item.component.html',
  styleUrls: ['./journal-entry-list-item.component.sass'],
})
export class JournalEntryListItemComponent implements OnInit {

  @Input() item$ ! : JournalEntry$

  constructor() { }

  ngOnInit() {}

}
