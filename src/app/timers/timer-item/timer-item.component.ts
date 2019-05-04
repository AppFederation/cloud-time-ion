import {Component, Input, OnInit} from '@angular/core';
import {Timer} from "../../core/Timer";
import {TimePickerComponent} from "../time-picker/time-picker.component";
import {ModalController} from "@ionic/angular";
import {TimersService} from "../../core/timers.service";
import {OverlayEventDetail} from '@ionic/core';

@Component({
  selector: 'app-timer-item',
  templateUrl: './timer-item.component.html',
  styleUrls: ['./timer-item.component.scss'],
})
export class TimerItemComponent implements OnInit {

  @Input()
  timer: Timer

  constructor(
      private modalController: ModalController,
      private timersService: TimersService,
  ) { }

  ngOnInit() {}


  async onSetDuration(timer: Timer) {
    console.log('onSetDuration before', timer)

    const modal: HTMLIonModalElement =
        await this.modalController.create({
          component: TimePickerComponent,
          componentProps: {
            aParameter: true,
            otherParameter: new Date(),
            timer: timer,
          }
        });
    console.log('onSetDuration', modal)
    await modal.present()

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
      }
    });
  }

}
