import {Injectable} from '@angular/core';
import {g} from './g'
import {CachedSubject} from './utils/cachedSubject2/CachedSubject2'
import {FeaturesConfig} from './FeaturesConfig'

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  config$: CachedSubject<FeaturesConfig> = new CachedSubject<FeaturesConfig>()

  constructor() {
    console.log('FeatureService ctor')
    // g.feat = this // DX FTW!
    const featuresConfig = new FeaturesConfig(
      {
        enableAll: false
      }
    )
    g.feat = featuresConfig
    this.config$.nextWithCache(featuresConfig)
  }

  setEnableAll(enabled: boolean) {
    console.log('FeaturesConfig setEnableAll', enabled)
    const featuresConfig1 = new FeaturesConfig(
      {
        enableAll: enabled
      }
    )
    g.feat = featuresConfig1
    this.config$.nextWithCache(featuresConfig1)
  }
}
