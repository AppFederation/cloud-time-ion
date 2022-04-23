import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from '../../TreeNode'
import {dictToArrayWithIds, getDictionaryValuesAsArray, setIdsFromKeys} from '../../../../utils/dictionary-utils'
import {OdmCell} from '../../../cells/OdmCell'

export function column(colDesc: any) {
  return colDesc
}

/** TODO: consider naming as COLUMNS cells */
@Component({
  selector: 'app-tree-node-cells',
  templateUrl: './tree-node-cells.component.html',
  styleUrls: ['./tree-node-cells.component.sass'],
})
export class TreeNodeCellsComponent implements OnInit {

  @Input()
  treeNode !: TreeNode

  columnsDict = setIdsFromKeys({
    /** or durationEstimate */
    estimatedTime: column({
      type: 'minMidMax'
    }),
    timeTracking: column({
      type: 'timeTracking'
    }),
    title: column({
      type: 'richText',
      flexGrow: 1,
    })
  })

  columns = getDictionaryValuesAsArray(this.columnsDict)

  cells = this.columns.map(cell => {
    return new OdmCell(this.treeNode, cell)
  })

  constructor() { }

  ngOnInit() {}

}
