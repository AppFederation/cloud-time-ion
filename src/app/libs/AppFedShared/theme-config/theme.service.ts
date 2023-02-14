import { Injectable } from '@angular/core';
import {ThemeId, themes} from './themes.data'
import {getRgbColorFromHex, luminance, shadeColor} from './color-utils'
import {ThemeCalculator, ThemeOptions} from './ThemeCalculator'



@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeCalculator = new ThemeCalculator()

  brightnessPercent = 50

  public themes = themes as any

  // public themeId: any/*keyof typeof themes*/ = 'Porzeczki Agrest'
  public themeId: any/*keyof typeof themes*/ = this.getRandomThemeId()

  constructor() {
    this.applyRandomTheme()
  }

  setThemeId(themeId: ThemeId) {
    this.themeId = themeId
    this.themeCalculator.updateColors(this.getThemeOptions())
  }

  setBrightnessPercent(brightnessPercent: number) {
    this.brightnessPercent = brightnessPercent
    console.log(`this.brightnessPercent`, this.brightnessPercent)
    this.updateColors()
  }

  public getRandomThemeId() {
    // TODO maybe update e.g. 1-2 times per week, to not get bored with all of them too quickly
    // "panic button" "craving fun" could also force new theme
    // later could have checkboxes to exclude themes from random picking
    const themeIds = Object.keys(themes)
    const themeIndex = Math.floor(Math.min(Math.random(), 0.999) * themeIds.length)
    const themeId = themeIds[themeIndex]

    console.log('getRandomThemeId', themeIndex, themeId)
    return themeId
  }

  applyRandomTheme() {
    while (true) {
      const newId = this.getRandomThemeId()
      if ( newId !== this.themeId ) {
        this.setThemeId(newId)
        break;
      }
    }
  }

  applyNextTheme() {
    // written by GH Copilot; nice:
    const themeIds = Object.keys(themes)
    const currentIndex = themeIds.indexOf(this.themeId)
    const nextIndex = (currentIndex + 1) % themeIds.length
    const nextId = themeIds[nextIndex]
    this.setThemeId(nextId)
  }

  public getThemeOptions(): ThemeOptions {
    const opts = new ThemeOptions()
    // opts.theme = this.getTheme()
    // opts.brightnessPercent = this.brightnessPercent

    return {
      ... opts,
      theme: this.getTheme(),
      brightnessPercent: this.brightnessPercent
    }
  }

  public getTheme() {
    return this.themes[this.themeId]
  }

  private updateColors() {
    this.themeCalculator.updateColors(this.getThemeOptions())
  }
}
