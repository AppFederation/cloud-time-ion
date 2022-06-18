import { OryColumn } from '../OryColumn'
import { OryTreeNode } from '../../tree-model/TreeModel'
import {
  Cells,
  ColumnCell,
} from './Cells'
import { ignoreUnused } from '../../utils/utils'

export class ColumnDefs {
  title = new OryColumn('title')
  subTitle = new OryColumn('subTitle')
  estimatedTimeMin = new OryColumn('estimatedTimeMin')
  estimatedTime = new OryColumn('estimatedTime')
  estimatedTimeMax = new OryColumn('estimatedTimeMax')
  /** TODO: another status: suspended; isSuspended, apart from done; to not distract but to be able, to still go back to it
   * with darkening and some sort of wavy strike-through */
  isDone = new OryColumn('isDone')
}

export const columnDefs = new ColumnDefs()


/** Consider renaming to "view slots" - more generic than columns, while more view-related than "property".
 * Or maybe PropertyView ? */
export class Columns {
  allVisibleColumns = [
    columnDefs.estimatedTimeMin,
    columnDefs.estimatedTime,
    columnDefs.estimatedTimeMax,
    columnDefs.title,
  ]

  get allNotHiddenColumns() {
    return this.allVisibleColumns.filter( col => ! col.hidden)
  }

  allColumns = [
    ...this.allVisibleColumns,
    columnDefs.isDone,
  ]

  get leftMostColumn() { return this.allVisibleColumns.find(column => ! column.hidden) }

  lastColumn = columnDefs.title // will need allVisibleColumns.findLast

  createColumnCells(treeNode: OryTreeNode) {
    const cells = new Cells()
    this.allColumns.forEach(column => {
      ignoreUnused(new ColumnCell(column, cells, treeNode))
    })
    return cells
  }
}
