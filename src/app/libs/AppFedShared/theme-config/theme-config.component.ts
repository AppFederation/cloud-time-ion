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

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.sass'],
})
export class ThemeConfigComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onSliderChange($event: any) {
    // let root: HTMLElement = document.documentElement;
    let root = document.getElementsByTagName("BODY")[0] ! as HTMLElement;
    // let root = document.getEl
    // const sliderVal =  0
    const sliderVal = $event.detail.value

    // it was gray and green cool theme

    // const color = '#000080'
    // // const color = '#800080'
    // const secondary = '#008000'

    // TODO: extract ThemeService, so I can e.g. fade in on app start

    // const color = '#800080'
    const primary = '#008000'
    const secondary = '#5050f0'

    const darkenVal = sliderVal / 50
    const centerVal = sliderVal / 75
    const lightenVal = sliderVal / 100
    // const darkenVal = 0 - sliderVal / 100
    // const lightenVal = 0 + sliderVal / 100


    // console.log('root.style', root.style);
    // FIXME: also try to set -rgb, coz button does not change color
    // Try this later with ionic 6 (can be in separate app)

    const colorName = `secondary`

    function setColorProp(colorName: string, colorVal: string) {
      // root.style.setProperty(`--ion-color-${colorName}-rgb`, colorVal);
      root.style.setProperty(`--ion-color-${colorName}-tint`, shadeColor(colorVal, lightenVal));
      root.style.setProperty(`--ion-color-${colorName}`, shadeColor(colorVal, centerVal));
      root.style.setProperty(`--ion-color-${colorName}-shade`, shadeColor(colorVal, darkenVal));
    }

    setColorProp('primary', primary)
    setColorProp('secondary', secondary)

    console.log('root.style', root.style);

  }

}