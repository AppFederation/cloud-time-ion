import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TimerItem} from '../core/TimerItem';
import {TimersService} from '../core/timers.service';
import {TimerDetailsComponent} from "./timer-details/timer-details.component";
import {debugLog} from "../libs/AppFedShared/utils/log";

@Component({
  selector: 'app-tab2',
  templateUrl: 'timers-page.component.html',
  styleUrls: ['timers-page.component.scss']
})
export class TimersPageComponent {

  constructor(
    private modalController: ModalController,
    private timersService: TimersService,
  ) {
  }

  async onAddTimer() {
    debugLog('onAddTimer')
    let timerItem = new TimerItem(this.timersService, '' + new Date(), undefined, 5, 'new timer')
    // timerItem
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: TimerDetailsComponent,
        componentProps: {
          timer: timerItem,
        }
      });
    await modal.present()
  }
}
