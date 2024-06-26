import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ChromeExtensionService} from './app/apps/Learn/shared/utils/chrome-extension.service'
import 'hammerjs'


import * as packageJson from '../package.json';

console.log('%cLifeSuite app main.ts %cstarting', 'color: red; background-color: black', 'color: lightblue; background-color: darkblue')


// import { inject } from '@vercel/analytics';

// inject();

console.log(`package.json - FIXME potential security hole - exposing package.json`, packageJson) // FIXME potential security hole - exposing package.json


if (environment.production) {
  enableProdMode();
}

if (ChromeExtensionService.isApplicationRunAsChromeExtension()) {
  const html = document.getElementsByTagName('html');
  html[0].classList.add('chrome-extension');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

declare global {
  function xyzTestGlobal(): void
}
