import {Component, HostListener} from '@angular/core';

import {Platform, PopoverController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TimerNotificationsService} from "./core/timer-notifications.service";
import {SyncStatusService} from './libs/AppFedShared/odm/sync-status.service'
// import {LearnStatsService} from './apps/Learn/core/learn-stats.service'
import {AuthService} from './auth/auth.service'
import {OptionsService} from './apps/Learn/core/options.service'
import {SyncPopoverComponent} from './libs/AppFedShared/odm/sync-status/sync-popover/sync-popover.component'
import {OptionsComponent} from './libs/AppFedShared/options/options.component'
import {ThemeService} from './libs/AppFedShared/theme-config/theme.service'
import {FeatureService} from './libs/AppFedShared/feature.service'
// import {fakeExportToNotLookUnused} from '../background/background'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private featureService /* force the service to run */: FeatureService,
    private ThemeService /* force the service to run */: ThemeService,
    // private timerNotificationService /* force the service to run */: TimerNotificationsService,
    private authService  /* force the service to run */: AuthService,
    // private learnStatsService  /* force the service to run */: LearnStatsService,
    public syncStatusService: SyncStatusService,
    public optionsService: OptionsService,
    public popoverController: PopoverController,
  ) {
    this.initializeApp();
  }

  // fakeExportToNotLookUnused = fakeExportToNotLookUnused + 'dummy' // causes `background.ts:7 Uncaught ReferenceError: firebase is not defined`

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false)

      this.splashScreen.hide();
      this.setupOptionsHandler()
      console.log('initializeApp ...')
    });
  }

  private setupOptionsHandler() {
    this.optionsService.openOptions$.subscribe(async (isOpen) => {
      if (isOpen) {
        const popover = await this.popoverController.create({
          component: OptionsComponent,
          event: event /* FIXME some global event object */,
          translucent: true,
          mode: 'ios',
        });
        return await popover.present();
      }
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload($event: any) {
    if ( this.syncStatusService.hasPendingUploads ) {
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
