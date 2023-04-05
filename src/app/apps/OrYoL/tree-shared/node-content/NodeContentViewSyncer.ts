import { OryColumn } from '../OryColumn'
import { CellComponent } from '../cells/CellComponent'
import {EventEmitter, Injector} from '@angular/core'
import { debugLog } from '../../utils/log'
import { ColumnCell } from './Cells'
import { OryTreeNode } from '../../tree-model/TreeModel'
import { Columns } from './Columns'
import {throttleTime} from 'rxjs/operators'
import {SyncStatusService} from '../../../../libs/AppFedShared/odm/sync-status.service'
import {TreeTableNode} from '../../tree-model/TreeTableNode'

/** other names: CellsViewSyncer
 *
 * ======== FIXME: problem with cursor being reset after TAB indent: is because another NodeContentViewSyncer instance is created,
 * which does not know about the previous.
 * This should be as much as possible on OdmItem$, instead of component view.
 * And the delay is not due to Firestore, but due to my DELAY_MS_THROTTLE_EDIT_PATCHES_TO_DB.
 *
 * @deprecated
 * */
export class NodeContentViewSyncer {

  constructor(
    protected injector: Injector,
    private treeNode: TreeTableNode,
    private columns: Columns,
    private mapColumnToComponent: Map<OryColumn, CellComponent>,
) {
  }

  applyItemDataValuesToViews() {
    // FIXME: take care of the inputValueEquals, isApplyingFromDbNow
    // if (this.elInputEstimatedTime.inputValueEquals(newValue)) {
    //   this.editedHere.set(column, false)
    // } else {
    // }
    for ( let entry of this.mapColumnToComponent.entries() ) {
      const col = entry[0], component = entry[1]
      if ( this.treeNode.canApplyDataToViewGivenColumnLocalEdits(col) ) {
        const fieldVal = col.getValueFromItemData(this.treeNode.itemData)
        component.setInputValue(fieldVal)
      } else {
        // TODO: schedule for applying to view later, unless user has edited locally again
      }
    }

  }

}
