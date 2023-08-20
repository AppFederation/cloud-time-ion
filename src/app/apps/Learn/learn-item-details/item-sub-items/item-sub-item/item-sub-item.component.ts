import {Component, Input, OnInit} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'

@Component({
  selector: 'app-item-sub-item',
  templateUrl: './item-sub-item.component.html',
  styleUrls: ['./item-sub-item.component.scss'],
})
export class ItemSubItemComponent implements OnInit {

  @Input() item$!: LearnItem$
  // @Input() item$!: OdmItem$2<any, any, any, any>

  constructor() { }

  ngOnInit() {}

}
