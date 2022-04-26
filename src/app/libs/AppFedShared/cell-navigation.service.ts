import { Injectable } from '@angular/core';
import {OdmCell} from './tree/cells/OdmCell'
import {Dict, setIdsFromKeys} from './utils/dictionary-utils'
import {AbstractCellComponent} from './AbstractCellComponent'
import {maxBy, minBy} from 'lodash-es'


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
    const focusedTop = fromCellComponent.viewportTop
    let compToFocus: AbstractCellComponent | undefined = undefined
    if ( direction === cellDirections.up ) {
      compToFocus = minBy([...this.cellComponents], comp => {
        const topDiff = focusedTop - comp.viewportTop
        if ( comp === fromCellComponent || topDiff < 0) {
          return 9999_999
        }
        return topDiff
      })
      console.log(compToFocus?.viewportTop)
      if ( ! compToFocus || (compToFocus.viewportTop >= focusedTop) ) {
        compToFocus = this.findBottommostComponent() // wrap-around
      }
    }
    if ( direction === cellDirections.down ) {
      compToFocus = minBy([...this.cellComponents], comp => {
        const topDiff = comp.viewportTop - focusedTop
        if ( comp === fromCellComponent || topDiff < 0) {
          return 9999_999
        }
        return topDiff
      })
      // NOTE: this wraps back to topmost
    }
    compToFocus?.focus()
    // TODO: wrap-around
  }

  constructor() { }

  public register(component: AbstractCellComponent) {
    this.cellComponents.add(component)
    console.log('Register component', component)
  }

  public deregister(component: AbstractCellComponent) {
    this.cellComponents.delete(component)
  }

  public findBottommostComponent() {
    const maxBy1 = maxBy([...this.cellComponents], comp => comp.viewportTop)
    console.log(`findBottommostComponent`, maxBy1)
    return maxBy1
  }
}
