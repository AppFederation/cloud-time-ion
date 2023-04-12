import {UserId} from '../../../auth/auth.service'
import {OryBaseTreeNode} from './RootTreeNode'

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


  onAfterCreated(newNode: OryBaseTreeNode) {
    const readPerms = {} as any
    readPerms[this.userId] = new Date()
    newNode.content.itemData.perms = {
      read: readPerms
    }
  }
}
