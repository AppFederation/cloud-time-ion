import {debugLog, errorAlert} from '../../utils/log'

/** NOTE: this should actually have been using ODM stuff like patchThrottled,
 * for code more independent from firestore;
 * and for tracking number of pending changes */
export function setOwnerIfNeeded(docData: firebase.firestore.DocumentData, docId: string) {
  if (this.collectionName === `JournalEntry`) {
    const existingOwner = docData?.owner
    const karolOwner = `7Tbg0SwakaVoCXHlu1rniHQ6gwz1`
    if (!existingOwner) {
      debugLog(this.collectionName + ` no owner `, existingOwner, docId)
      this.itemDoc(docId).update({
        owner: karolOwner
      }).then(() => {
        debugLog(`finished updating owner`, docId)
      })
    } else {
      // debugLog(this.collectionName + ` yes owner `, docId, existingOwner)
      if (existingOwner !== karolOwner) {
        errorAlert(`some other owner!!`, `docId:`, docId, `owner: `, existingOwner)
      }
    }
  }
}
