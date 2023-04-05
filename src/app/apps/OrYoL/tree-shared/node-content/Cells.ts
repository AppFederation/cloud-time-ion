import { OryColumn } from '../OryColumn'
import { OryTreeNode } from '../../tree-model/TreeModel'

export class ColumnCell<
  TVal = any,
  TColumn extends OryColumn<TVal> = OryColumn<TVal>,
  TNode extends OryTreeNode<any, any, any, any, any> = OryTreeNode<any, any, any, any, any>
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
