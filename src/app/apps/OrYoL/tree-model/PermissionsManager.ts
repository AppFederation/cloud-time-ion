import { OryTreeNode } from './TreeModel'
import {UserId} from '../../../auth/auth.service'

export class PermissionsManager {

  constructor(
    public userId: UserId
  ) {
    if ( ! userId ) {
      // window.alert('! userId: ' + userId)
      console.error('! userId: ' + userId)
    }
    this.userId = 'FAKE_USER' // FIXME
  }


  onAfterCreated(newNode: OryTreeNode) {
    const readPerms = {} as any
    readPerms[this.userId] = new Date()
    newNode.itemData.perms = {
      read: readPerms
    }
  }
}
