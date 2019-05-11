import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";
import {AlertController, ModalController} from "@ionic/angular";
import {TimersService} from "../../core/timers.service";

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss'],
})
export class TimerDetailsComponent implements OnInit {

  @Input()
  timer: TimerItem

  get endTime() {
    return new Date(Date.now() + this.timer.durationSeconds * 1000)
  }

  constructor(
      public alertController: AlertController,
      public timersService: TimersService,
      private modalController: ModalController,
  ) { }

  ngOnInit() {}

  onDurationSecondsChanged($event: number) {
    this.timer.durationSeconds = $event
    this.timersService.save(this.timer)
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Delete timer?',
      // message: 'Delete <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'DELETE',
          handler: () => {
            this.timersService.delete(this.timer)
            this.modalController.dismiss()
          }
        }
      ]
    })
    await alert.present()
  }
}
