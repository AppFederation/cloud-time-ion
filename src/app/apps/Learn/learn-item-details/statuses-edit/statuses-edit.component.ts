import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItem$} from '../../models/LearnItem$'
import {statusesArray} from '../../models/statuses.model'

@Component({
  selector: 'app-statuses-edit',
  templateUrl: './statuses-edit.component.html',
  styleUrls: ['./statuses-edit.component.sass'],
})
export class StatusesEditComponent implements OnInit {

  @Input()
  @Required()
  public item$ ! : LearnItem$

  choosableStatuses = statusesArray

  constructor() { }

  ngOnInit() {}

}
