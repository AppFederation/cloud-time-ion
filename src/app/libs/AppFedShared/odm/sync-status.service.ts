import { Injectable } from '@angular/core';
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {errorAlert} from '../utils/log'

export class SyncStatus {
  pendingUploadsCount ? : number
}

type SyncTask = Promise<any> | {then: any}

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {

  pendingPromises = new Set<SyncTask>()

  public readonly syncStatus$ = new CachedSubject<SyncStatus>()

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
    this.syncStatus$.next({
      pendingUploadsCount: this.pendingPromises.size
    })
  }
}
