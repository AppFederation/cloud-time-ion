import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject'

@Injectable()
export class DebugService {

  IS_DEBUG_KEY = 'oryol_is_debug'


  public isDebug$ = new ReplaySubject<boolean>(1)
  public static isDebug: boolean

  constructor() {
    DebugService.isDebug = JSON.parse(window.localStorage.getItem(this.IS_DEBUG_KEY))
    this.isDebug$.next(DebugService.isDebug)
    this.isDebug$.subscribe(value => {
      window.localStorage.setItem(this.IS_DEBUG_KEY, '' + value)
      DebugService.isDebug = value
    })
  }

}
