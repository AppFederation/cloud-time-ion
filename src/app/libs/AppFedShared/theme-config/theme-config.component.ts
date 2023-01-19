import { Component, OnInit } from '@angular/core';

/**
 * @param color Hex value format: #ffffff or ffffff
 * @param decimal lighten or darken decimal value, example 0.5 to lighten by 50% or 1.5 to darken by 50%.
 */
function shadeColor(color: string, decimal: number): string {
  const base = color.startsWith('#') ? 1 : 0;

  let r = parseInt(color.substring(base, 3), 16);
  let g = parseInt(color.substring(base + 2, 5), 16);
  let b = parseInt(color.substring(base + 4, 7), 16);

  r = Math.round(r / decimal);
  g = Math.round(g / decimal);
  b = Math.round(b / decimal);

  r = (r < 255)? r : 255;
  g = (g < 255)? g : 255;
  b = (b < 255)? b : 255;

  const rr = ((r.toString(16).length === 1)? `0${r.toString(16)}` : r.toString(16));
  const gg = ((g.toString(16).length === 1)? `0${g.toString(16)}` : g.toString(16));
  const bb = ((b.toString(16).length === 1)? `0${b.toString(16)}` : b.toString(16));

  return `#${rr}${gg}${bb}`;
}

type RGB = [number, number, number];

function getRgbColorFromHex(hex: string) {
  hex = hex.slice(1);
  const value = parseInt(hex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return [r, g, b] as RGB;
};

function luminance(rgb: RGB) {
  const [r, g, b] = rgb.map((v: any) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};

const themes = {
  'Porzeczki Agrest': {
    comment: 'Jellies',
    primary: '#c72323',
    secondary: '#b68001',
  },
  'Gray Green': {
    comment: 'Jellies',
    primary: '#6e6e6e',
    secondary: '#007e00',
  },
  'Blue Orange': {
    comment: 'Blueberries and orange',
    primary: '#004cb7',
    secondary: '#007e00',
  },
}

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.sass'],
})
export class ThemeConfigComponent implements OnInit {

  Object = Object

  themes = themes as any

  brightness = 50

  themeId: any/*keyof typeof themes*/ = 'Porzeczki Agrest'

  constructor() { }

  ngOnInit() {}

  onSliderChange($event: any) {
    this.brightness = $event.detail.value
    this.updateColors()
  }

  updateColors() {
    // let root: HTMLElement = document.documentElement;
    let root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;
    // let root = document.getEl
    // it was gray and green cool theme

    // const color = '#000080'
    // // const color = '#800080'
    // const secondary = '#008000'

    // TODO: extract ThemeService, so I can e.g. fade in on app start

    // const color = '#800080'
    // const primary = '#008000'
    // const secondary = '#5050f0'

    const {primary, secondary} = themes[this.themeId as keyof typeof themes]

    const darkenVal = this.brightness / 50
    const centerVal = this.brightness / 75
    const lightenVal = this.brightness / 100
    // const darkenVal = 0 - sliderVal / 100
    // const lightenVal = 0 + sliderVal / 100


    // console.log('root.style', root.style);
    // FIXME: also try to set -rgb, coz button does not change color
    // Try this later with ionic 6 (can be in separate app)

    function setColorProp(colorName: string, colorVal: string) {
      // root.style.setProperty(`--ion-color-${colorName}-rgb`, colorVal);
      const centralColor = shadeColor(colorVal, centerVal)
      const luminance1 = luminance(getRgbColorFromHex(centralColor))
      console.log('luminance1' + colorName + ` $centralColor`, luminance1)
      root.style.setProperty(`--ion-color-${colorName}-contrast`,
        luminance1 < 0.37 ? 'white' : 'black');
      root.style.setProperty(`--ion-color-${colorName}-tint`, shadeColor(colorVal, lightenVal));
      root.style.setProperty(`--ion-color-${colorName}-tint`, shadeColor(colorVal, lightenVal));
      root.style.setProperty(`--ion-color-${colorName}`, centralColor);
      root.style.setProperty(`--${colorName}`, centralColor);
      root.style.setProperty(`--ion-color-${colorName}-shade`, shadeColor(colorVal, darkenVal));
    }


    setColorProp('primary', primary)
    setColorProp('secondary', secondary)

    console.log('root.style', root.style);
  }
}
