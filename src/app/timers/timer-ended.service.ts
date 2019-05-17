import { Injectable } from '@angular/core';
import {TimersPageModule} from "./timers.module";
import {ModalController} from "@ionic/angular";
import {TimerEndedComponent} from "./timer-ended/timer-ended.component";
import {TimerItem} from "../core/TimerItem";

@Injectable({
  providedIn: TimersPageModule
})
export class TimerEndedService {

  constructor(
    private modalController: ModalController,
  ) {}

  async showTimerEnded(timer: TimerItem) {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: TimerEndedComponent,
        componentProps: {
          timer: timer,
        }
      });
    console.log('onSetDuration', modal)
    await modal.present()

    modal.onDidDismiss().then(() => {
      // if (detail !== null) {
      //   // console.log('modal result:', detail.data);
      // }
    });
  }
}
