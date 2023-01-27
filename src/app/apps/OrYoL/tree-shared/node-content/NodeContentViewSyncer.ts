import { OryColumn } from '../OryColumn'
import { CellComponent } from '../cells/CellComponent'
import { EventEmitter } from '@angular/core'
import { debugLog } from '../../utils/log'
import { ColumnCell } from './Cells'
import { OryTreeNode } from '../../tree-model/TreeModel'
import { Columns } from './Columns'
import {throttleTime} from 'rxjs/operators'

/** other names: CellsViewSyncer */
export class NodeContentViewSyncer {
  // isApplyingFromDbNow = false   /** TODO: to NodeContentViewSyncer */

  whenLastEditedLocallyByColumn = new Map<OryColumn, Date>()

  private mapColumnToEventEmitterOnChange = new Map<OryColumn, EventEmitter<any>>()

  private pendingThrottledItemDataPatch = {}

  /** 500ms almost real-time feeling without overwhelming firestore.
   Perhaps Firestore has "SLA" of around 1second latency anyway (I recall reading something like that,
   where they contrasted the latency with Firebase Realtime DB.
   At 500ms Firefox seems to be lagging behind like even up to 3 seconds after finishing typing.
   2018-11-27 23:14 Increased from 1000 to 4000ms after problem with cursor position reset returned */
  private readonly DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB = 3000

  private readonly DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB = 7000

  constructor(
    private treeNode: OryTreeNode,
    private columns: Columns,
    private mapColumnToComponent: Map<OryColumn, CellComponent>,
) {
    this.subscribeDebouncedOnChangePerColumns()
  }


  /* TODO move the throttling to Item$
  * Here tackling bug with losing part of title when editing-then-indent.
  * When indenting, it's new UI component.
  *
  * Maybe indenting could force committing the delayed (throttled) change.
  *  */
  private subscribeDebouncedOnChangePerColumns() {
    for ( const column of this.columns.allColumns ) {
      const throttleTimeConfig = {
        leading: true /* probably thanks to this, the first change, of a series, is immediate (observed experimentally) */,
        /* think about false; usually single character; but what if someone pastes something, then it will be fast;
        plus a single character can give good indication that someone started writing */
        trailing: true /* ensures last value is not lost;
          http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-throttleTime */
      }
      const scheduler = undefined
      this.getEventEmitterOnChangePerColumn(column).pipe(
        throttleTime(
          this.DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB , scheduler, throttleTimeConfig
        )
      ).subscribe((changeEvent) => {
        debugLog('onInputChanged; isApplyingFromDbNow', this.treeNode.treeModel.isApplyingFromDbNow)
        if (!this.treeNode.treeModel.isApplyingFromDbNow) {
          // const itemData = this.buildItemDataFromUi()
          this.treeNode.patchItemData(this.pendingThrottledItemDataPatch) // patching here
          this.pendingThrottledItemDataPatch = {}
        } // else: no need to react, since it is being applied from Db
      })
    }
  }

  private getEventEmitterOnChangePerColumn(column: OryColumn) {
    let eventEmitter = this.mapColumnToEventEmitterOnChange.get(column)
    if ( ! eventEmitter ) {
      eventEmitter = new EventEmitter()
      this.mapColumnToEventEmitterOnChange.set(column, eventEmitter)
    }
    return eventEmitter
  }

  private canApplyDataToViewGivenColumnLocalEdits(column: OryColumn) {
    return this.canApplyDataToViewGivenColumnLastLocalEdit(column)
      /* &&!this.editedHere.get(column)*/
  }

  private canApplyDataToViewGivenColumnLastLocalEdit(column: OryColumn) {
    /* note, this should also take focus into account
     --> evolved to the when-last-edited idea */
    const lastEditedByColumn = this.whenLastEditedLocallyByColumn.get(column)
    if ( ! lastEditedByColumn ) {
      return true
    } else {
      const timeNow = new Date().getTime() /* milliseconds since 1970/01/01 */
      // can only apply incoming changes to view if at least N seconds passed since last local edit
      const msPassedSinceLastEditPerCol = timeNow - lastEditedByColumn.getTime()
      return msPassedSinceLastEditPerCol > this.DELAY_MS_BETWEEN_LOCAL_EDIT_AND_APPLYING_FROM_DB
    }
    /* idea for storing previus locally user-entered vals,
     * to ensure they don't "come back from the grave" if long delay of coming from DB */
  }

  onInputChangedByUser(cell: ColumnCell, inputNewValue: any) {
    const column = cell.column
    column.setValueOnItemData(this.pendingThrottledItemDataPatch, inputNewValue)
    this.getEventEmitterOnChangePerColumn(column).emit(column)
    // this.editedHere.set(column, true)
    this.whenLastEditedLocallyByColumn.set(column, new Date())
  }

  applyItemDataValuesToViews() {
    // FIXME: take care of the inputValueEquals, isApplyingFromDbNow
    // if (this.elInputEstimatedTime.inputValueEquals(newValue)) {
    //   this.editedHere.set(column, false)
    // } else {
    // }
    for ( let entry of this.mapColumnToComponent.entries() ) {
      const col = entry[0], component = entry[1]
      if ( this.canApplyDataToViewGivenColumnLocalEdits(col) ) {
        const fieldVal = col.getValueFromItemData(this.treeNode.itemData)
        component.setInputValue(fieldVal)
      } else {
        // TODO: schedule for applying to view later, unless user has edited locally again
      }
    }

  }

}
