import { Component, OnInit } from '@angular/core';
import {BaseComponent} from '../base/base.component'
import {enableAll} from '../base.service'

@Component({
  selector: 'app-feature-config',
  templateUrl: './feature-config.component.html',
  styleUrls: ['./feature-config.component.sass'],
})
export class FeatureConfigComponent extends BaseComponent implements OnInit {

  constructor() { super() }

  ngOnInit() {}

  onChangeAllFeatures($event: any) {
    enableAll = $event.target.value
  }
}
