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
import {AngularFireStorage, AngularFireStorageModule} from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

// custom configuration Hammerjs
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = <any> {
    // I will only use the swap gesture so
    // I will deactivate the others to avoid overlaps
    'pinch': { enable: false },
    'rotate': { enable: false },
    press: {
      time: 1000,
    }
  }
}

@NgModule({

  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    CoreModule,
    ShoppingListsModule, /* HACK as a kind of core, for shopping list service*/
    AngularFireStorageModule, BrowserAnimationsModule,
    HammerModule,
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
export class AppModule {}
