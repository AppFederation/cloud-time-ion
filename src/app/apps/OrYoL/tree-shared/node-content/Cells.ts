import { OryColumn } from '../OryColumn'
import {OryBaseTreeNode} from '../../tree-model/TreeModel'
import {RootTreeNode} from '../../tree-model/RootTreeNode'

export class ColumnCell<
  TVal = any,
  TColumn extends OryColumn<TVal> = OryColumn<TVal>,
  TNode extends OryBaseTreeNode = OryBaseTreeNode
> {
  constructor(
    public column: TColumn,
    public cells: Cells,
    public treeNode: TNode
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
