import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ChromeExtensionService} from './app/apps/Learn/shared/utils/chrome-extension.service'

if (environment.production) {
  enableProdMode();
}

if (ChromeExtensionService.isApplicationRunAsChromeExtension()) {
  const html = document.getElementsByTagName('html');
  html[0].classList.add('extension');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

declare global {
  function xyzTestGlobal(): void
}
