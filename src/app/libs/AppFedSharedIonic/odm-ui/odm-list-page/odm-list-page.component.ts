import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {OdmListItemDirective} from "../odm-list/odm-list-item.directive";
import {OdmList} from "../../../AppFedShared/odm/OdmList";

type TItem = any

@Component({
  selector: 'app-odm-list-page',
  templateUrl: './odm-list-page.component.html',
  styleUrls: ['./odm-list-page.component.sass'],
})
export class OdmListPageComponent implements OnInit {

  @Input() parentList: OdmList<TItem>

  @Input() createItemFunc

  /** https://alligator.io/angular/reusable-components-ngtemplateoutlet/ */
  @ContentChild(OdmListItemDirective, {read: TemplateRef}) itemTemplate

  constructor() { }

  ngOnInit() {}

  onAddItem() {
    const newItem = this.createItemFunc();
    this.parentList.add(newItem)
    // TODO: open details dialog, allowing to add to multiple lists (many-to-many)
    // draft gets saved automatically

    // when User is happy, saves non-draft in details dialog
    newItem.saveNowToDb()
  }
}
