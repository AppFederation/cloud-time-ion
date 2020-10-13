import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../core/sidesDefs'

@Component({
  selector: 'app-side-icon',
  templateUrl: './side-icon.component.html',
  styleUrls: ['./side-icon.component.sass'],
})
export class SideIconComponent implements OnInit {

  @Input() side ! : Side

  constructor() { }

  ngOnInit() {}

}
