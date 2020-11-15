import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionService {

  constructor() { }

  // https://stackoverflow.com/questions/7507277/detecting-if-code-is-being-run-as-a-chrome-extension
  public static isApplicationRunAsChromeExtension(): boolean {
    return !!(window as any).chrome?.runtime?.getManifest?.()?.background;
  }
}
