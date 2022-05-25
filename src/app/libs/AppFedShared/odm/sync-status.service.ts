import {Injectable} from '@angular/core';
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {errorAlert} from '../utils/log'

export class SyncStatus {
  pendingUploadsCount ? : number
  pendingDownloadsCount ? : number
}

type SyncTask = Promise<any> | {then: any}

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {

  pendingPromises = new Set<SyncTask>()

  pendingDownloads = new Set<string>()

  public readonly syncStatus$ = new CachedSubject<SyncStatus>()

  get hasPendingUploads() {
    return this.syncStatus$.lastVal ?. pendingUploadsCount
  }

  constructor() { }

  handleSavingPromise(promise: SyncTask) {
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
      pendingDownloadsCount: this.pendingDownloads.size
    }
    console.log(`emitSyncStatus`, val, this.pendingDownloads)
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
