import {Component, Injector, OnInit} from '@angular/core';
import {themes} from './themes.data'
import {ThemeService} from './theme.service'
import {BaseComponent} from '../base/base.component'



@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.sass'],
})
export class ThemeConfigComponent extends BaseComponent implements OnInit {

  Object = Object

  themes = this.themeService.themes

  themesVisible = false

  constructor(
    public themeService: ThemeService,
    injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {}

  onSliderChange($event: any) {
    this.themeService.setBrightnessPercent(100 - $event.detail.value)
  }

}
