import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";
import {TimePickerComponent} from "../../AppFedSharedIonic/time/time-picker/time-picker.component";
import {ModalController} from "@ionic/angular";
import {TimersService} from "../../core/timers.service";
import {OverlayEventDetail} from '@ionic/core';
import {TimerDetailsComponent} from "../timer-details/timer-details.component";
import {debugLog} from "../../AppFedShared/utils/log";

@Component({
  selector: 'app-timer-item',
  templateUrl: './timer-item.component.html',
  styleUrls: ['./timer-item.component.sass'],
})
export class TimerItemComponent implements OnInit {

  @Input()
  timer: TimerItem

  get isRunning() { return this.timer.isRunning }

  constructor(
      private modalController: ModalController,
      private timersService: TimersService,
  ) { }

  ngOnInit() {}


  async onClickTimerItem(timer: TimerItem) {
    debugLog('onSetDuration before', timer)

    const modal: HTMLIonModalElement =
        await this.modalController.create({
          component: TimerDetailsComponent,
          componentProps: {
            timer: timer,
          }
        });
    console.log('onSetDuration', modal)
    await modal.present()

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        // console.log('modal result:', detail.data);
      }
    });
  }

}
