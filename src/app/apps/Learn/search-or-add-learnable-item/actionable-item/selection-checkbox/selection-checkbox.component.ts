import { Component, OnInit } from '@angular/core';
import {Selection} from '../../selection'

@Component({
  selector: 'app-selection-checkbox',
  templateUrl: './selection-checkbox.component.html',
  styleUrls: ['./selection-checkbox.component.sass'],
})
export class SelectionCheckboxComponent implements OnInit {

  selection = new Selection()

  constructor() { }

  ngOnInit() {}

}
