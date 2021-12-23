import {OdmItem$2} from '../../odm/OdmItem$2'
import {CachedSubject} from '../../utils/cachedSubject2/CachedSubject2'

export class TreeNode<TOdmItem$ extends OdmItem$2<any, any, any, any> = any> {

  childNodesList$ = new CachedSubject<TreeNode[] | undefined>(undefined)

  constructor(
    /** an item can have multiple parents, but a node only has one parent */
    public parentNode: TreeNode<any> | undefined,
    public item$: TOdmItem$
  ) {
  }

  requestLoadChildren(depth = 1) {
    /* This could preload a number of levels recursively */
    setTimeout(() => {
      this.childNodesList$.nextWithCache([
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
        new TreeNode(this, undefined as any),
      ])
    }, 2_000)
  }

}
