import { Injectable } from '@angular/core';
import {OdmCell} from './tree/cells/OdmCell'
import {Dict, setIdsFromKeys} from './utils/dictionary-utils'
import {AbstractCellComponent} from './AbstractCellComponent'
import {minBy} from 'lodash-es'


export type CellDirectionId = string & { type: CellDirectionId }

export interface CellDirection {
  type: 'CellDirection'
  id: CellDirectionId
}

function cellDir(param: {}) {
  return param as CellDirection;
}

export const cellDirections = setIdsFromKeys({
  parent: cellDir({} /* 0, 0, -1 xyz */),
  /** drill-down / child */
  deeper: cellDir({}),
  up: cellDir({}),
  down: cellDir({}),
  left: cellDir({}),
  right: cellDir({}),
})

/** Related: NavigationService which handles full-screen item next/previous/ & index-of-total */
@Injectable({
  providedIn: 'root'
})
export class CellNavigationService {

  cellComponents = new Set<AbstractCellComponent>()

  getCellVisuallyInDirection(fromCell: OdmCell, direction: CellDirection) {

  }

  navigateToCellVisuallyInDirection(direction: CellDirection, fromCellComponent: AbstractCellComponent) {
    console.log('navigateToCellVisuallyInDirection', direction)
    const rect = fromCellComponent.elementRef.nativeElement.getBoundingClientRect()
    let compNearest: AbstractCellComponent | undefined = undefined
    if ( direction === cellDirections.up ) {
      compNearest = minBy([...this.cellComponents], comp => {
        const topDiff = rect.top - comp.elementRef.nativeElement.getBoundingClientRect().top
        if ( comp === fromCellComponent || topDiff < 0) {
          return 9999_999
        }
        return topDiff
      })
    }
    if ( direction === cellDirections.down ) {
      compNearest = minBy([...this.cellComponents], comp => {
        const topDiff = comp.elementRef.nativeElement.getBoundingClientRect().top - rect.top
        if ( comp === fromCellComponent || topDiff < 0) {
          return 9999_999
        }
        return topDiff
      })
      // NOTE: this wraps back to topmost
    }
    compNearest?.focus()
    // TODO: wrap-around
  }

  constructor() { }

  register(component: AbstractCellComponent) {
    this.cellComponents.add(component)
    console.log('Register component', component)
  }

  deregister(component: AbstractCellComponent) {
    this.cellComponents.delete(component)
  }
}
