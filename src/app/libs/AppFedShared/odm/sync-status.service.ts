import {Injectable, Injector} from '@angular/core';
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {errorAlert} from '../utils/log'
import {appGlobals} from '../g'
import {BaseService} from '../base.service'

export class SyncStatus {
  pendingUploadsCount ? : number
  pendingDownloadsCount ? : number
  isAllSynced ! : boolean
}

/** consider putting 'titleOfChange' here */
type SyncTask = Promise<any> | {then: any}

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService extends BaseService {

  pendingPromises = new Set<SyncTask>()

  pendingDownloads = new Set<string>()

  public readonly syncStatus$ = new CachedSubject<SyncStatus>()

  get hasPendingUploads() {
    return this.syncStatus$.lastVal ?. pendingUploadsCount
  }

  constructor(
    injector: Injector,
  ) {
    super(injector)
    console.log('SyncStatusService ctor')
  }

  /** crude placeholder to distinguish "Unsaved" From "Saving...";
   * later unify unsaved -> saving; and even provide link to item/node in question, and original and new value; and cells/columns names
   *
   * it can contain multiple changes;
   * multiple batches could be pending "on" same object, if slow internet;
   * if offline, they can prolly keep accumulating; maybe they should overwrite previous ones
   * */
  handleUnsavedPromise(promise: SyncTask, titleOfChange?: string) {
    this.handleSavingPromise(promise)
  }

  handleSavingPromise(promise: SyncTask, titleOfChange?: string) {
    this.pendingPromises.add(promise)
    this.emitSyncStatus()
    promise.then(() => {
      this.pendingPromises.delete(promise)
      this.emitSyncStatus()
    }).catch((error: any) => {
      errorAlert(`Unable to save: `, error)
    })
  }

  private emitSyncStatus() {
    const val = {
      pendingUploadsCount: this.pendingPromises.size,
      pendingDownloadsCount: this.pendingDownloads.size,
      isAllSynced: !this.pendingPromises.size && !this.pendingDownloads.size,
    }
    // if ( appGlobals.feat.showDebug ) {
    //   console.log(`emitSyncStatus`, val, this.pendingDownloads)
    // }
    this.syncStatus$.next(val)
  }

  addPendingDownload(dl: { name: string }) {
    this.pendingDownloads.add(dl.name)
    this.emitSyncStatus()
  }

  removePendingDownload(dl: { name: string }) {
    this.pendingDownloads.delete(dl.name)
    this.emitSyncStatus()
  }

}
