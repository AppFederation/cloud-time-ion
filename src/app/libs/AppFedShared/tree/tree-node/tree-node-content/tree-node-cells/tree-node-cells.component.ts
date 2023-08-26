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
    // /** or durationEstimate */
    // estimatedTime: column({
    //   type: 'minMidMax'
    // }),
    // timeTracking: column({
    //   type: 'timeTracking'
    // }),
    title: column({
      type: 'richText',
      flexGrow: 1,
    })
  })

  columns = getDictionaryValuesAsArray(this.columnsDict)

  cells!: OdmCell<any>[]

  constructor() { }

  ngOnInit() {
    this.cells = this.columns.map(column => {
      return new OdmCell(this.treeNode, column)
    })
  }

}
