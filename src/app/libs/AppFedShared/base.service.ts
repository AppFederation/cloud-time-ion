import {Injectable, Injector} from '@angular/core';
import {g} from './g'
import {FeatureService} from './feature.service'
import {FeaturesConfig} from './FeaturesConfig'
import {FeatureLevelsConfig} from './FeatureLevelsConfig'


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  g = g

  feat: FeaturesConfig = this.g.feat

  featLocal: FeatureLevelsConfig = this.g.feat // TODO: onSetLocalFeat() in subclasses later

  constructor(
    public injector: Injector
  ) {
    this.injector.get(FeatureService).config$.subscribe((cfg: FeaturesConfig) => {
      this.feat = cfg
    })
  }
}
