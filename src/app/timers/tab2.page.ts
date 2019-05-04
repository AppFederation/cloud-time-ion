import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimerItem } from '../core/TimerItem';
import { TimersService } from '../core/timers.service';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

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


  onAddTimer() {
    this.timersService.add(new TimerItem('' + new Date(), undefined, 99, 'new timer'))
  }
}
