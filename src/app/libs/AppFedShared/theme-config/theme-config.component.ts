import { Component, OnInit } from '@angular/core';
import {themes} from './themes.data'
import {ThemeService} from './theme.service'



@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.sass'],
})
export class ThemeConfigComponent implements OnInit {

  Object = Object

  themes = this.themeService.themes

  themesVisible = false

  constructor(
    public themeService: ThemeService,
  ) { }

  ngOnInit() {}

  onSliderChange($event: any) {
    this.themeService.setBrightnessPercent(100 - $event.detail.value)
  }

}
