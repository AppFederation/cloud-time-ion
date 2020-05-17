import { Injectable } from '@angular/core';
import {CachedSubject} from '../utils/CachedSubject'

export class SyncStatus {
  pendingUploadsCount: number
}

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {

  pendingPromises = new Set<Promise<any>>()

  public readonly syncStatus$ = new CachedSubject<SyncStatus>()

  constructor() { }

  handleSavingPromise(promise: Promise<any>) {
    this.pendingPromises.add(promise)
    this.emitSyncStatus()
    promise.then(() => {
      this.pendingPromises.delete(promise)
      this.emitSyncStatus()
    })
  }

  private emitSyncStatus() {
    this.syncStatus$.next({pendingUploadsCount: this.pendingPromises.size})
  }
}
