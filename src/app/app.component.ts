import {Component, HostListener} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TimerNotificationsService} from "./core/timer-notifications.service";
import {AuthService} from "./core/auth.service";
import {SyncStatusService} from './libs/AppFedShared/odm/sync-status.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private timerNotificationService /* force the service to run */: TimerNotificationsService,
    private authService  /* force the service to run */: AuthService,
    public syncStatusService: SyncStatusService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false)

      this.splashScreen.hide();
      console.log('initializeApp ...')
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload($event: any) {
    if ( this.syncStatusService.syncStatus$.lastVal ?. pendingUploadsCount ) {
      // TODO: record throttled patches too
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
      // Cancel the event as stated by the standard.
      $event.preventDefault();
      // Chrome requires returnValue to be set.
      $event.returnValue = 'Your data will be lost!';
      /// TODO: https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
    }
  }

}
