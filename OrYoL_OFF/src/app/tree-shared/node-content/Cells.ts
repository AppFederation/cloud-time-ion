import { OryColumn } from '../OryColumn'
import { OryTreeNode } from '../../tree-model/TreeModel'

export class ColumnCell<TVal = any> {
  constructor(
    public column: OryColumn<TVal>,
    public cells: Cells,
    public treeNode: OryTreeNode
  ) {
    this.cells.add(this)
  }

}


export class Cells {
  mapColumnToCell = new Map<OryColumn, ColumnCell>()

  cells: Array<ColumnCell> = []

  add(cell: ColumnCell) {
    if ( cell.column ) {
      this.mapColumnToCell.set(cell.column, cell)
    }
    this.cells.push(cell)
  }

  forColumn(column: OryColumn) {
    return this.mapColumnToCell.get(column)
  }

}
