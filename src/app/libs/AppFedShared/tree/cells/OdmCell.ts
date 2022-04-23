import {OdmItem$2} from '../../odm/OdmItem$2'
import {TreeNode} from '../tree-node/TreeNode'

/** This could also handle stuff like aggregate values (as sub-cells?)
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

  type = this.column?.type

  constructor(
    public readonly treeNode?: TreeNode,
    public readonly column?: any,
    /* row / column for getCellAbove / Below / Left / Right */
  ) {
  }

  patchThrottled(newValue: TValue, event?: any) {
    const patch: any = {
      title: newValue /* FIXME take from column */
    }
    this.treeNode!.item$.patchThrottled(patch)
    console.error('HACK patching title')
  }

}
