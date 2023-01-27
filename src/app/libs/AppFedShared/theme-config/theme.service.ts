import { Injectable } from '@angular/core';
import {themes} from './themes.data'
import {getRgbColorFromHex, luminance, shadeColor} from './color-utils'

export type ThemeId = string


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public themes = themes as any

  brightnessPercent = 50

  // public themeId: any/*keyof typeof themes*/ = 'Porzeczki Agrest'
  public themeId: any/*keyof typeof themes*/ = this.getRandomThemeId()

  constructor() {
    this.applyRandomTheme()
  }

  // private readonly contrastLuminanceThreshold = 0.37
  // private readonly contrastLuminanceThreshold = 0.25
  // private readonly contrastLuminanceThreshold = 0.1
  private readonly contrastLuminanceThreshold = 0.15
  // private readonly contrastLuminanceThreshold = 0.9


  protected updateColors() {
    // it was gray and green cool theme

    // const color = '#000080'
    // // const color = '#800080'
    // const secondary = '#008000'

    // TODO: extract ThemeService, so I can e.g. fade in on app start

    // const color = '#800080'
    // const primary = '#008000'
    // const secondary = '#5050f0'

    const theme = themes[this.themeId as keyof typeof themes]
    const {primary, secondary, background} = theme

    // const darkenVal = 0 - sliderVal / 100
    // const lightenVal = 0 + sliderVal / 100


    // console.log('root.style', root.style);
    // FIXME: also try to set -rgb, coz button does not change color
    // Try this later with ionic 6 (can be in separate app)


    this.setColorProps('primary', primary)
    this.setColorProps('secondary', secondary)
    // this.setColorProps('background', background || '#000000')

    const root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;
    root.style.setProperty(`--ion-background-color`, background || '#000000');


    // console.log('root.style', root.style);
  }

  setColorProps(colorName: string, colorVal: string) {
    const isDarkTheme = true // TODO

    const darkenVal = this.brightnessPercent / 50
    const centerVal = this.brightnessPercent / 75
    const lightenVal = this.brightnessPercent / 100

    // let root: HTMLElement = document.documentElement;
    const root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;
    // let root = document.getEl

    // root.style.setProperty(`--ion-color-${colorName}-rgb`, colorVal);
    const centralColor = shadeColor(colorVal, centerVal)
    const luminance1 = luminance(getRgbColorFromHex(centralColor))
    console.log('luminance1 ' + colorName + ` $centralColor`, luminance1)
    root.style.setProperty(`--ion-color-${colorName}-contrast`,
      luminance1 < this.contrastLuminanceThreshold ? 'white' : 'black');
    // root.style.setProperty(`--ion-color-${colorName}-muted`,
    //   /** workaround for logo disappearing on page navigation */
    // 'gray' /* TODO might wanna vary on luminance */); // TODO: prolly better to have it as transparency
    root.style.setProperty(`--ion-color-${colorName}-contrast-muted`,
      /** workaround for logo disappearing on page navigation */
      centralColor+'80')
    const tinted = shadeColor(colorVal, lightenVal)
    root.style.setProperty(`--ion-color-${colorName}-tint`, tinted);
    root.style.setProperty(`--ion-color-${colorName}`, centralColor);
    root.style.setProperty(`--${colorName}`, centralColor);
    const shaded = shadeColor(colorVal, darkenVal)
    root.style.setProperty(`--ion-color-${colorName}-shade`, shaded);

    if (isDarkTheme) { /* highlight color to stand against background: */
      root.style.setProperty(`--ion-color-${colorName}-highlight`, `var(--ion-color-primary-tint`);
    } else {
      root.style.setProperty(`--ion-color-${colorName}-highlight`, `var(--ion-color-primary-shade`);
    }
  }

  setThemeId(themeId: ThemeId) {
    this.themeId = themeId
    this.updateColors()
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
        this.themeId = newId
        break;
      }
    }
    this.updateColors()
  }

  applyNextTheme() {
    // this.the
  }
}
