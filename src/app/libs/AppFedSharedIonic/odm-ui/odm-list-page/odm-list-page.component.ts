import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {OdmListItemDirective} from "../odm-list/odm-list-item.directive";

@Component({
  selector: 'app-odm-list-page',
  templateUrl: './odm-list-page.component.html',
  styleUrls: ['./odm-list-page.component.sass'],
})
export class OdmListPageComponent implements OnInit {

  @Input() parentItem

  @Input() creatItemFunc

  /** https://alligator.io/angular/reusable-components-ngtemplateoutlet/ */
  @ContentChild(OdmListItemDirective, {read: TemplateRef}) itemTemplate

  constructor() { }

  ngOnInit() {}

  onAddItem() {
    this.creatItemFunc().saveNowToDb()
  }
}
