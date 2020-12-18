import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'

@Component({
  selector: 'item-list-switcher',
  templateUrl: './item-list-switcher.component.html',
  styleUrls: ['./item-list-switcher.component.sass'],
})
export class ItemListSwitcherComponent implements OnInit {

  @Input()
  items: LearnItem$[] | undefined;

  constructor() { }

  ngOnInit() {}

}