import { Injectable } from '@angular/core';
import {ApfNonRootTreeNode} from '../tree-model/TreeNode'
import {ApfBaseTreeNode, OryBaseTreeNode} from '../tree-model/RootTreeNode'

@Injectable({providedIn: 'root'})
export class ClipboardService {

  private _nodesInClipboard: OryBaseTreeNode[] = []

  constructor() { }

  setNodesInClipboard(nodesInClipboard: OryBaseTreeNode[]) {
    this._nodesInClipboard = nodesInClipboard
  }

  get hasContent() {
    return this._nodesInClipboard.length > 0
  }

  get nodesInClipboard() {
    return this._nodesInClipboard
  }

}
