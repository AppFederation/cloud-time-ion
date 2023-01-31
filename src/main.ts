import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ChromeExtensionService} from './app/apps/Learn/shared/utils/chrome-extension.service'
import 'hammerjs'


import * as packageJson from '../package.json';

import { inject } from '@vercel/analytics';

inject();

console.log('after vercel inject')


console.log(`
      last commit: commit 35e028e72e74dfab8033f53f895b48c98d76768f (HEAD -> develop, origin/develop, origin/HEAD)
      Author: Karol Depka <karol-depka@users.noreply.github.com>
      Date:   Sat Jan 28 08:28:53 2023 +0100
      ).catch((caught: any)`
)

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
