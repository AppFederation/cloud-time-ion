import {Type} from '@angular/core'
import {ItemListInterface} from '../../../../apps/Learn/search-or-add-learnable-item/item-lists/item-list-interface'
import {IonVirtualListComponent} from '../../../../apps/Learn/search-or-add-learnable-item/item-lists/ion-virtual-list/ion-virtual-list.component'
import {SimpleListComponent} from '../../../../apps/Learn/search-or-add-learnable-item/item-lists/simple-list/simple-list.component'
import {CdkVirtualListComponent} from '../../../../apps/Learn/search-or-add-learnable-item/item-lists/cdk-virtual-list/cdk-virtual-list.component'

export class DisplayList {
  private constructor(public id: string,
                      public name: string,
                      public component: Type<ItemListInterface>) {
  }

  public static displayLists = [
      new DisplayList("ionic-virtual-list", "Ionic List", IonVirtualListComponent),
      new DisplayList("simple-list", "Simple list", SimpleListComponent),
      new DisplayList("cdk-virtual-list", "Virtual list", CdkVirtualListComponent),
  ];

  public static findById(id: string) {
    for (let list of this.displayLists) {
      if (list.id === id) {
        return list;
      }
    }
    return this.displayLists[0];
  }
}
