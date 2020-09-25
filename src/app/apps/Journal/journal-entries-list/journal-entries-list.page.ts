import { Component, OnInit } from '@angular/core';
import {JournalEntriesService} from '../core/journal-entries.service'
import {JournalEntry$} from '../models/JournalEntry$'

@Component({
  selector: 'app-journal-entries-list',
  templateUrl: './journal-entries-list.page.html',
  styleUrls: ['./journal-entries-list.page.sass'],
})
export class JournalEntriesListPage implements OnInit {

  constructor(
    public journalEntriesService: JournalEntriesService,
  ) { }

  ngOnInit() {
  }

  trackById(index: number, item: JournalEntry$) {
    return item.id
  }

}
