import { Injectable } from '@angular/core';
import { OryTreeNode } from '../tree-model/TreeModel'

@Injectable()
export class ClipboardService {

  private _nodesInClipboard: OryTreeNode[] = []

  constructor() { }

  setNodesInClipboard(nodesInClipboard: OryTreeNode[]) {
    this._nodesInClipboard = nodesInClipboard
  }

  get hasContent() {
    return this._nodesInClipboard.length > 0
  }

  get nodesInClipboard() {
    return this._nodesInClipboard
  }

}
