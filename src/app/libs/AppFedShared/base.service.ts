import {Injectable, Injector} from '@angular/core';
import {g} from './g'
import {FeatureService} from './feature.service'
import {FeaturesConfig} from './FeaturesConfig'
import {FeatureLevelsConfig} from './FeatureLevelsConfig'
import {CachedSubject} from './utils/cachedSubject2/CachedSubject2'
import {Config, ConfigService} from '../../apps/OrYoL/core/config.service'


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  g = g

  feat: FeaturesConfig = this.g.feat

  configService = this.injector.get(ConfigService)

  config$: CachedSubject<Config> = this.configService.config$

  featLocal: FeatureLevelsConfig = this.g.feat // TODO: onSetLocalFeat() in subclasses later

  constructor(
    public injector: Injector
  ) {
    this.injector.get(FeatureService).config$.subscribe((cfg: FeaturesConfig) => {
      this.feat = cfg
    })
  }
}
