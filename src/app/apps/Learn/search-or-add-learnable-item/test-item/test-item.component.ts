import {Component, Input, OnInit} from '@angular/core';
import {LearnItem} from '../../models/LearnItem'

@Component({
  selector: 'app-test-item',
  templateUrl: './test-item.component.html',
  styleUrls: ['./test-item.component.sass'],
})
export class TestItemComponent implements OnInit {

  @Input() itemInp: LearnItem

  constructor() { }

  ngOnInit() {}

}
