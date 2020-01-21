import { OryColumn } from '../OryColumn'
import { OryTreeNode } from '../../tree-model/TreeModel'
import {
  Cells,
  ColumnCell,
} from './Cells'
import { ignoreUnused } from '../../utils/utils'


/** Consider renaming to "view slots" - more generic than columns, while more view-related than "property".
 * Or maybe PropertyView ? */
export class Columns {
  title = new OryColumn('title')
  estimatedTimeMin = new OryColumn('estimatedTimeMin')
  estimatedTime = new OryColumn('estimatedTime')
  estimatedTimeMax = new OryColumn('estimatedTimeMax')
  isDone = new OryColumn('isDone')
  allVisibleColumns = [
    this.estimatedTimeMin,
    this.estimatedTime,
    this.estimatedTimeMax,
    this.title,
  ]

  get allNotHiddenColumns() {
    return this.allVisibleColumns.filter( col => ! col.hidden)
  }

  allColumns = [
    ...this.allVisibleColumns,
    this.isDone,
  ]

  get leftMostColumn() { return this.allVisibleColumns.find(column => ! column.hidden) }

  lastColumn = this.title // will need allVisibleColumns.findLast

  createColumnCells(treeNode: OryTreeNode) {
    const cells = new Cells()
    this.allColumns.forEach(column => {
      ignoreUnused(new ColumnCell(column, cells, treeNode))
    })
    return cells
  }
}
