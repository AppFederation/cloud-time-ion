import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {SelectionManager} from '../SelectionManager'

@Component({
  selector: 'app-selection-info',
  templateUrl: './selection-info.component.html',
  styleUrls: ['./selection-info.component.sass'],
})
export class SelectionInfoComponent implements OnInit {

  @Required()
  @Input() selection ! : SelectionManager


  constructor() { }

  ngOnInit() {}

}
