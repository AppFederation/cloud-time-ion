import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";
import {AlertController, ModalController} from "@ionic/angular";
import {TimersService} from "../../core/timers.service";
import {FormControl} from "@angular/forms";
import {ignorePromise} from "../../utils/promiseUtils";

@Component({
  selector: 'app-timer-details',
  templateUrl: './timer-details.component.html',
  styleUrls: ['./timer-details.component.scss'],
})
export class TimerDetailsComponent implements OnInit {

  @Input()
  timer: TimerItem

  timerTitleControl = new FormControl('');

  get endTime() {
    return new Date(Date.now() + this.timer.durationSeconds * 1000)
  }

  constructor(
      public alertController: AlertController,
      public timersService: TimersService,
      private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.timerTitleControl.setValue(this.timer.title)
    this.timerTitleControl.valueChanges.subscribe(titleValue => {
      this.timer.patchThrottled({
        title: titleValue
      })
    })
  }

  onDurationSecondsChanged($event: number) {
    this.timer.patchThrottled({
      durationSeconds: $event
    })
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Delete timer ' + this.timer.title + "?",
      // message: 'Delete <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'DELETE',
          handler: () => {
            this.timer.deleteWithoutConfirmation()
            this.dismissModal()
          }
        }
      ]
    })
    await alert.present()
  }

  private dismissModal() {
    return ignorePromise(this.modalController.dismiss())
  }

  async confirmStopTimer() {
    const alert = await this.alertController.create({
      header: 'STOP timer ' + this.timer.title + "?",
      // message: 'Delete <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'STOP',
          handler: () => {
            this.timer.stopTimer()
          }
        }
      ]
    })
    await alert.present()
  }

  onClickDismiss() {
    this.dismissModal()
  }
}
