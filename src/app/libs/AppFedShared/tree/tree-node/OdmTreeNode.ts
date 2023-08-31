import {OdmItem$2} from '../../odm/OdmItem$2'
import {CachedSubject} from '../../utils/cachedSubject2/CachedSubject2'
import {map} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'

export class OdmTreeNode<
  TOdmItem$ extends
    OdmItem$2<any, any, any, any> =
    OdmItem$2<any, any, any, any>
  > {

  isExpanded = true

  /* TODO use OdmList$ */
  childNodesList$: Observable<OdmTreeNode<TOdmItem$>[] | undefined> = this.item$.childrenList$.pipe(map((children: TOdmItem$[] | undefined) => {
    /* FIXME: do not create new TreeNode each time */
    return !children ? undefined : children.map((childItem: TOdmItem$) => {
      return new OdmTreeNode(this, childItem)
    })
  }))// new CachedSubject<TreeNode[] | undefined>(undefined)

  constructor(
    /** an item can have multiple parents, but a node only has one parent (or no parent, for root node) */
    public parentNode: OdmTreeNode<any> | undefined,
    public item$: TOdmItem$
  ) {
  }

  requestLoadChildren(depth = 1) {
    this.item$.requestLoadChildren()
    this.item$.requestLoadTreeDescendants()
    /* This could preload a number of levels recursively */
    // setTimeout(() => {
    //   this.childNodesList$.nextWithCache([
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //     new TreeNode(this, undefined as any),
    //   ])
    // }, 2_000)
  }

}
