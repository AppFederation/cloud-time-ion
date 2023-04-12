import { Injectable } from '@angular/core';
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'


import {RootTreeNode} from '../tree-model/RootTreeNode'

/* Distinguish between navigation and focus?*/
@Injectable({
  providedIn: 'root' /* Note: might need to change to CoreModule?? */
})
export class NavigationService {

  /* TODO: distinguish between focus and navigation */
  public readonly navigation$ = new CachedSubject<string>()

  constructor() { }

  navigateToNodeLastChild(node: RootTreeNode) {
    this.navigation$.next(node.itemId)
  }
}
