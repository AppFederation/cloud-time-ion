import { OryColumn } from '../OryColumn'

export class ColumnCell<TVal = any> {
  constructor(
    public column: OryColumn<TVal>,
    public cells: Cells,
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
