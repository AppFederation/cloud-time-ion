import { OryColumn } from '../OryColumn'
import { OryTreeNode } from '../../tree-model/TreeModel'
import {
  Cells,
  ColumnCell,
} from './Cells'


/** Consider renaming to "view slots" - more generic than columns, while more view-related than "property".
 * Or maybe PropertyView ? */
export class Columns {
  title = new OryColumn('title')
  estimatedTimeMin = new OryColumn('estimatedTimeMin')
  estimatedTime = new OryColumn('estimatedTime')
  estimatedTimeMax = new OryColumn('estimatedTimeMax')
  isDone = new OryColumn('isDone')
  allColumns = [
    this.title,
    this.estimatedTimeMin,
    this.estimatedTime,
    this.estimatedTimeMax,
    this.isDone,
  ]
  lastColumn = this.title
  leftMostColumn = this.estimatedTime

  createColumnCells(treeNode: OryTreeNode) {
    const cells = new Cells()
    this.allColumns.forEach(column => {
      new ColumnCell(column, cells, treeNode)
    })
    return cells
  }
}
