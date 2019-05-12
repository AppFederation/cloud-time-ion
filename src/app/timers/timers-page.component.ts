import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimerItem } from '../core/TimerItem';
import { TimersService } from '../core/timers.service';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { OverlayEventDetail } from '@ionic/core';
import {TimerDetailsComponent} from "./timer-details/timer-details.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'timers-page.component.html',
  styleUrls: ['timers-page.component.scss']
})
export class TimersPageComponent {

  endTime
  private timeLeft: number;

  constructor(
      private modalController: ModalController,
      private timersService: TimersService,
  ) {

  }

  onChangeTime(event) {
    console.log('event', event)
    // this.endTime = new Date(new Date().getTime() + 10 * 10000)
    this.endTime = new Date(Date.now() + 5 * 1000)
    // alert('change')
  }

  ngOnInit() {
    setInterval(() => {
      this.timeLeft = (this.endTime - Date.now())/ 1000
    }, 1000)
  }


  async onAddTimer() {
    let timerItem = new TimerItem('' + new Date(), undefined, 5, 'new timer');
    this.timersService.add(timerItem)
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
