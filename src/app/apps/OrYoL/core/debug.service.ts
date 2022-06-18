import { Injectable } from '@angular/core';
import {CachedSubject} from '../../../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

@Injectable()
export class DebugService {

  IS_DEBUG_KEY = 'oryol_is_debug'


  public isDebug$ = new CachedSubject<boolean>()
  public static isDebug: boolean

  constructor() {
    DebugService.isDebug = JSON.parse(window.localStorage.getItem(this.IS_DEBUG_KEY) || 'false')
    this.isDebug$.next(DebugService.isDebug)
    this.isDebug$.subscribe(value => {
      window.localStorage.setItem(this.IS_DEBUG_KEY, '' + value)
      DebugService.isDebug = value
    })
  }

}
