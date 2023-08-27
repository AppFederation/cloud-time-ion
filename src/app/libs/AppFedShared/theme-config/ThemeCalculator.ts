import {Theme} from './themes.data'
import {getRgbColorFromHex, luminance, shadeColor} from './color-utils'

export class ThemeOptions {
  theme!: Theme
  brightnessPercent = 50


  // private readonly contrastLuminanceThreshold = 0.37
  // private readonly contrastLuminanceThreshold = 0.25
  // private readonly contrastLuminanceThreshold = 0.1
  public readonly contrastLuminanceThreshold = 0.15
  // private readonly contrastLuminanceThreshold = 0.9

}

export class ThemeCalculator {

  public updateColors(themeOptions: ThemeOptions) {

    const theme = themeOptions.theme
    const {primary, secondary} = theme
    const background = shadeColor(theme.background || '#101010', themeOptions.brightnessPercent / 75)

    // const darkenVal = 0 - sliderVal / 100
    // const lightenVal = 0 + sliderVal / 100


    // console.log('root.style', root.style);
    // FIXME: also try to set -rgb, coz button does not change color

    this.setColorProps('primary', primary, themeOptions)
    this.setColorProps('secondary', secondary, themeOptions)
    // this.setColorProps('background', background || '#000000')

    const root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;
    root.style.setProperty(`--ion-background-color`, background);

    const itemAndTextBg = shadeColor(background, themeOptions.brightnessPercent / 85)
    // console.log(`itemAndTextBg`, itemAndTextBg)
    root.style.setProperty(`--ion-item-background`, itemAndTextBg);

    // consider --afed- prefix more pronounceable and unique

    /* could have a general -clickable- or -editable- (interactive tangible click/edit area) color, more general and precise than item or text color
      - e.g. for sliders interactive area; yes, I'm kinda creating my own design system, next to /
     */
    root.style.setProperty(`--apf-text-edit-background`, 'var(--ion-item-background)');
    /** This could be closer to black/white coz might have wider variety of colors going from rich text */
    root.style.setProperty(`--apf-rich-text-edit-background`, 'var(--ion-item-background)');
    root.style.setProperty(`--apf-item-header-background`, 'var(--ion-item-background)');
    root.style.setProperty(`--ion-item-border-color`, 'var(--ion-item-background)'); // prototype
    root.style.setProperty(`--ion-border-color`, 'var(--ion-item-background)'); // prototype
    // TODO: item-separator (for items list)
    // TODO: item-shadow (for OrYoL if enabled)


    // console.log('root.style', root.style);
  }

  setColorProps(colorName: string, colorVal: string, themeOptions: ThemeOptions) {
    const isDarkTheme = true // TODO

    const darkenVal = themeOptions.brightnessPercent / 50
    const centerVal = themeOptions.brightnessPercent / 75
    const lightenVal = themeOptions.brightnessPercent / 100

    // let root: HTMLElement = document.documentElement;
    const root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;

    // root.style.setProperty(`--ion-color-${colorName}-rgb`, colorVal);
    const centralColor = shadeColor(colorVal, centerVal)
    const luminance1 = luminance(getRgbColorFromHex(centralColor))
    // console.log('luminance1 ' + colorName + ` $centralColor`, luminance1)
    root.style.setProperty(`--ion-color-${colorName}-contrast`,
      luminance1 < themeOptions.contrastLuminanceThreshold ? 'white' : 'black');
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

}
