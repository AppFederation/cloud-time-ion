import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {LearnItem} from '../search-or-add-learnable-item/search-or-add-learnable-item.page'

@Component({
  selector: 'app-actionable-item',
  templateUrl: './actionable-item.component.html',
  styleUrls: ['./actionable-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionableItemComponent implements OnInit {

  @Input() item: LearnItem
  // @Input() search: string

  constructor() { }

  ngOnInit() {}

}
