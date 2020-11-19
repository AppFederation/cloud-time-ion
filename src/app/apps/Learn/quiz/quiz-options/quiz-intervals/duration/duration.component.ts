import {Component, Input, OnInit} from '@angular/core';
import {nullish} from '../../../../../../libs/AppFedShared/utils/type-utils'

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.sass'],
})
export class DurationComponent implements OnInit {

  @Input()
  intervalDays: number | nullish

  constructor() { }

  ngOnInit() {}

  getMonths() {
    return this.intervalDays ! / 30
  }
}
