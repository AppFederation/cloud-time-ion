import { Injectable } from '@angular/core';
import { OryTreeNode } from '../tree-model/TreeModel'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

/* Distinguish between navigation and focus?*/
@Injectable({
  providedIn: 'root' /* Note: might need to change to CoreModule?? */
})
export class NavigationService {

  /* TODO: distinguish between focus and navigation */
  public readonly navigation$ = new CachedSubject<string>()

  constructor() { }

  navigateToNodeLastChild(node: OryTreeNode) {
    this.navigation$.next(node.itemId)
  }
}
