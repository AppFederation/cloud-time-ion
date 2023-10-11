import {OdmItem$2} from '../../odm/OdmItem$2'
import {OdmTreeNode} from '../tree-node/OdmTreeNode'

/**
 * What is a Cell: a particular location (coordinates) in UI (implying keyboard navigation, sometimes URL),
 * that can be patched (written to) and listened for value changes
 * (via PatchableObservable, which itself does not indicate any location in UI)
 * Examples:
 * - cross-section of column and tree-table node
 * - field editor/view on detail view of an item
 *
 * The coordinates should be serializable (for URL / local storage / DB), e.g. for last cursor focus location.
 *
 * Cell should be the place where to handle protection from incoming changes from DB, which are really induced by local user edits.
 * Because it's view's-model (model but already backing a particular UI component).
 *
 *
 * This could also handle stuff like aggregate values (as sub-cells?)
 * - might be aware of thing like user-specific (overlay) values (e.g. user-specific importance for category)
 *    -  item$.patchUserSpecific()
 * - might be aware of provided vs effective values
 *
 * -- getCellAbove / Below / Left / Right
 *
 * Form editing (ViewSyncer2) should probably also go through this class
 *  - also keyboard navigation between cells (form inputs)
 * */
export class OdmCell<TValue = any> {

  // private item$: OdmItem$2<any, TValue, any, any>
  patchableObservable = this.treeNode.item$.getObservablePatchableForField(/** this.column.fieldName ?? */ this.column.id )

  type = this.column?.type

  constructor(
    public readonly treeNode: OdmTreeNode,
    public readonly column: any,
    /* row / column for getCellAbove / Below / Left / Right */
  ) {
  }

  patchThrottled(newValue: TValue, event?: any) {
    // const patch: any = {
    //   title: newValue /* FIXME take from column */
    // }
    // this.treeNode!.item$.patchThrottled(patch)
    this.patchableObservable.patchThrottled(newValue)
  }

}
