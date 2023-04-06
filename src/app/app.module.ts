import {Injectable, NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";
import {ShoppingListsModule} from "./apps/ShopNext/shopping-lists/shopping-lists.module";
import {AngularFireStorage, AngularFireStorageModule} from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {HttpClientModule} from '@angular/common/http';
import {DbFirestoreModule} from './apps/OrYoL/db-firestore/db-firestore.module'
import { fas } from '@fortawesome/free-solid-svg-icons';
import {StoreModule} from '@ngrx/store'
import {counterReducer} from './apps/Learn/core/quiz/quiz.reducer'
import {EffectsModule} from '@ngrx/effects'
import {QuizEffects} from './apps/Learn/core/quiz/quiz.effects'
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'

// custom configuration Hammerjs
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  override overrides = <any> {
    // I will only use the swap gesture so
    // I will deactivate the others to avoid overlaps
    'pinch': { enable: false },
    'rotate': { enable: false },
    press: {
      time: 1000,
    }
  }
}

const swOpts = {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}

console.log(`service worker swOpts`, swOpts)

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        SharedModule,
        CoreModule,
        ShoppingListsModule,
        AngularFireStorageModule, BrowserAnimationsModule,
        HammerModule,
        DbFirestoreModule,
        HttpClientModule /* Only for primeng tree demo */,
        StoreModule.forRoot({ count: counterReducer }),
        StoreDevtoolsModule.instrument({
            maxAge: 125, // Retains last 25 states
            // logOnly: environment.production, // Restrict extension to log-only mode
            // autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        }),
        EffectsModule.forRoot([QuizEffects]),
        ServiceWorkerModule.register('ngsw-worker.js', swOpts),
    ],
    exports: [
        CoreModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig
        }
        // { provide: RouteReuseStrategy, useClass: }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    /** https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/upgrading/0.4.0-0.5.0.md#migrate-from-global-icon-library-to-faiconlibrary
     * https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/upgrading/0.5.0-0.6.0.md */
    faIconLibrary: FaIconLibrary,
  ) {
    faIconLibrary.addIconPacks(fas);
  }

}
