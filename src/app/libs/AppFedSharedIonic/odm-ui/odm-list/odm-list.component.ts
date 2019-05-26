import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {OdmService} from "../../../AppFedShared/odm/OdmService";
import {OdmItem} from "../../../AppFedShared/odm/OdmItem";
import {OdmListItemDirective} from "./odm-list-item.directive";

type TItem = OdmItem<any>

@Component({
  selector: 'app-odm-list',
  templateUrl: './odm-list.component.html',
  styleUrls: ['./odm-list.component.sass'],
})
export class OdmListComponent implements OnInit /* could extend non-ionic OdmListComponent */{


  /** https://alligator.io/angular/reusable-components-ngtemplateoutlet/ */
  @ContentChild(OdmListItemDirective, {read: TemplateRef}) itemTemplate

  /** TODO: allow parent items (e.g. shopping lists) */
  @Input() parentItem: OdmService<TItem>

  @Input() sortCompareFunction

  constructor() { }

  ngOnInit() {}

  // private _compareFn: (t1: any, any) => (number) = (t1, t2) => {
  //   if ( t1.isRunning && t2.isRunning ) {
  //     return t1.endTime.getTime() - t2.endTime.getTime()
  //   }
  //   if ( t1.isRunning) {
  //     return -1 // TODO more
  //   } else if ( t2.isRunning) {
  //     return 1 // TODO more
  //   } else {
  //     return t1.durationSeconds - t2.durationSeconds
  //   }
  // };

  sortItems(items: TItem[]) {
    if ( items == null ) {
      return items
    }
    return items
    // return items.sort(this._compareFn)
    // FIXME: sort in service
  }

  trackById(index: number, item: TItem) {
    return item.id
  }

}
