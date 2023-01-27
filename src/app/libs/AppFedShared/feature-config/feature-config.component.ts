import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component'
import {FeatureService} from '../feature.service'
// import packageJson from '../../../../package.json'

@Component({
  selector: 'app-feature-config',
  templateUrl: './feature-config.component.html',
  styleUrls: ['./feature-config.component.sass'],
})
export class FeatureConfigComponent extends BaseComponent implements OnInit {



  constructor(
    public featureConfigService: FeatureService,
    injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {}

  onChangeAllFeatures($event: any) {
    this.featureConfigService.setEnableAll($event.detail.checked)
    // enableAll = $event.target.value
  }

}
