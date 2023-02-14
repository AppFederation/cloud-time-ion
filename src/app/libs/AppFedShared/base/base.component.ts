import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {g} from '../g'
import {FeatureService} from '../feature.service'
import {FeaturesConfig} from '../FeaturesConfig'
import {CachedSubject} from '../utils/cachedSubject2/CachedSubject2'
import {Config, ConfigService} from '../../../apps/OrYoL/core/config.service'

/** This is syntactic sugar and automation to improve DX where angular has DX shortcomings
 * and to reduce boilerplate and distractions when coding ACTUAL FEATURES
 *
 * Provides basic bookkeeping and lifecycle and DI, reactivity, config
 * */
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.sass'],
})
export class BaseComponent implements OnInit {

  configService = this.injector.get(ConfigService)

  config$: CachedSubject<Config> = this.configService.config$


  constructor(
    public injector: Injector
  ) {
    this.injector.get(FeatureService).config$.subscribe((cfg: FeaturesConfig) => {
      this.feat = cfg
      this.injector.get(ChangeDetectorRef).markForCheck()
      // TODO this could also trigger change detection
    })
  }

  // inject<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T {
  //   return this.injector?.get()
  // }


  /** to have it in template scope */
  public g = g

  /** this way we refer to features specific to this component (enabled per page/feature basis)
   *
   * Initializing this could actually work nicely as injection token on feature modules!
   * */
  public feat = g.feat

  // constructor( /* prolly will need to pass injector */ ) { }

  ngOnInit() {}

  // could have automatic rxjs subscribe/unsubscribe
  subscribeAuto() {

  }

}
