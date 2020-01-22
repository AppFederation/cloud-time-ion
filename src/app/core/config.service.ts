import { Injectable } from '@angular/core';
import { CachedSubject } from '../utils/cachedSubject2/CachedSubject2'

export class Config {
  showMinMaxColumns?
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public readonly config$ = new CachedSubject<Config>( {} )

  constructor() { }

  patchConfig(patch: any) {
    this.config$.next({
      ... this.config$.lastVal,
      ... patch
    })
  }
}
