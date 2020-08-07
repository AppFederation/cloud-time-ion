import { Injectable } from '@angular/core';
import {TimersPageModule} from "./timers.module";
import {ModalController} from "@ionic/angular";
import {TimerEndedComponent} from "./timer-ended/timer-ended.component";
import {TimerItem} from "../core/TimerItem";
import {debugLog} from '../libs/AppFedShared/utils/log'

@Injectable({
  providedIn: TimersPageModule
})
export class TimerEndedService {

  constructor(
    private modalController: ModalController,
  ) {}

  async showTimerEnded(timer: TimerItem) {
    if ( TimerEndedComponent.isDialogOpenForTimer(timer.id !) ) {
      return
    }
    TimerEndedComponent.addTimerDialog(timer.id !)
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: TimerEndedComponent,
        componentProps: {
          timer: timer,
        }
      });
    console.log('onSetDuration', modal)
    await modal.present()
    debugLog('after await modal.present()')

    modal.onDidDismiss().then(() => {
      TimerEndedComponent.removeTimerDialog(timer.id !)
    })
  }
}
