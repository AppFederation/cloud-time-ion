import { Component, OnInit } from '@angular/core';
import {ThemeService} from '../../../libs/AppFedShared/theme-config/theme.service'
import {Router} from '@angular/router'
import {FeatureService} from '../../../libs/AppFedShared/feature.service'
import {BaseComponent} from '../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-what-next',
  templateUrl: './what-next.page.html',
  styleUrls: ['./what-next.page.scss'],
})
export class WhatNextPage extends BaseComponent implements OnInit {

  constructor(
    public themeService: ThemeService,
    public featureService: FeatureService,
    public router: Router,
  ) {
    super()
  }

  ngOnInit() {
  }

  async cravingFun() {
    // TODO: popup with fancy image of doing smth fun. Piorun, spread wings.
    this.themeService.applyRandomTheme()
    await this.router.navigateByUrl('/fun')
  }
}
