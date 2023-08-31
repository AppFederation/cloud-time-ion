import {Component, Input, OnInit} from '@angular/core';
import {OdmTreeNode} from '../../OdmTreeNode'
import {dictToArrayWithIds, getDictionaryValuesAsArray, setIdsFromKeys} from '../../../../utils/dictionary-utils'
import {OdmCell} from '../../../cells/OdmCell'


/** TODO: consider naming as COLUMNS cells */
@Component({
  selector: 'app-tree-node-cells',
  templateUrl: './tree-node-cells.component.html',
  styleUrls: ['./tree-node-cells.component.sass'],
})
export class TreeNodeCellsComponent implements OnInit {

  @Input()
  treeNode !: OdmTreeNode

  ngOnInit(): void {
  }



}
