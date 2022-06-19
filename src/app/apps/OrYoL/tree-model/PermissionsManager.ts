import { UserId } from '../core/auth.service'
import { OryTreeNode } from './TreeModel'

export class PermissionsManager {

  constructor(
    public userId: UserId
  ) {
    if ( ! userId ) {
      window.alert('! userId: ' + userId)
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