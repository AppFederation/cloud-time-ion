import {
  NodeAddEvent,
  NodeInclusion,
} from './TreeListener'
import {
  debugLog, errorAlert,
  FIXME,
  traceLog,
} from '../utils/log'
import { DbTreeService } from './db-tree-service'
import {
  EventEmitter,
  Injectable,
  Injector,
} from '@angular/core'
import { sumBy } from 'lodash-es';
import { OryColumn } from '../tree-shared/OryColumn'
import { MultiMap } from '../utils/multi-map'
import {
  NodeOrderer,
  NodeOrderInfo,
} from './node-orderer'
import { PermissionsManager } from './PermissionsManager'
import {
  DbItem,
  ItemId,
  NodeInclusionId,
} from '../db/DbItem'
import {
  sumRecursivelyIncludingRoot,
  sumRecursivelyJustChildren,
} from '../utils/collection-utils'
import { HasItemData } from './has-item-data'
import { DataItemsService } from '../core/data-items.service'
import {
  minutesToString,
  parseTimeToMinutes,
} from '../utils/time-utils'
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'
import {TreeNode} from 'primeng/api'
import {isEmpty, nullOrUndef, uuidv4} from '../../../libs/AppFedShared/utils/utils-from-oryol'
import {lastItemOrUndefined} from '../../../libs/AppFedShared/utils/arrayUtils'
import {isNullish} from '../../../libs/AppFedShared/utils/utils'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {AuthService} from '../../../auth/auth.service'
import {TreeTableNode} from './TreeTableNode'
import {TreeModel} from './TreeModel'
// import {TreeTableNode} from './TreeTableNode'

/**
 * Created by kd on 2017-10-27.
 *
 * NOTE: this file has both TreeModel and TreeNode to avoid a warning about circular dependency between files.
 * Maybe I will find a better way, perhaps involving refactor...
 */


/** ======================================================================================= */
/** TODO: this should be delegated to database as it might have its own conventions/implementation (e.g. firebase push id) */
let generateNewInclusionId = function () {
  return 'inclusion_' + uuidv4()
}



/** =========================================================================== */
/** =========================================================================== */
/** ===========================================================================
 */
@Injectable()
export class TreeTableModel<
  TBaseNode extends TreeTableNode = TreeTableNode,
  TRootNode extends TBaseNode = TBaseNode,
  TNonRootNode extends TBaseNode = TBaseNode,
  TItemData = any,
> extends TreeModel<TBaseNode, TRootNode, TNonRootNode, TItemData>
{
  protected override createTreeNode(nodeInclusion: NodeInclusion, itemId: ItemId, itemData: TItemData): TBaseNode {
    return new TreeTableNode(this.injector, nodeInclusion, itemId, this, itemData) as TBaseNode
  }

}
