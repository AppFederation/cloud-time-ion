import { errorAlert } from '../utils/log'
import {ItemData} from './has-item-data'

export class TimeStamper {

  onBeforeSaveToDb(itemData: ItemData) {
    // cannot save whenCreated here, because it would be misleading for items which were created before timestamping was implemented
    // TODO: Firestore might have its own timestamp format
    itemData.whenLastModified = new Date()

    // TODO: Think about setting some modification date on parents when child gets modified
    // TODO: think about setting modification timestamp on item inclusions too
  }

  onAfterCreated(itemData: ItemData) {
    //
    if ( ! itemData.whenCreated ) {
      itemData.whenCreated = new Date()
    } else {
      errorAlert('onAfterCreated: item already has whenCreated timestmap', itemData, itemData.whenCreated)
    }
  }

}
