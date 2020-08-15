import {Component, Input, OnInit} from '@angular/core';
import {Side} from '../../core/sidesDefs'

@Component({
  selector: 'app-side-label',
  templateUrl: './side-label.component.html',
  styleUrls: ['./side-label.component.sass'],
})
export class SideLabelComponent implements OnInit {

  @Input() side ! : Side

  constructor() { }

  ngOnInit() {}

}
