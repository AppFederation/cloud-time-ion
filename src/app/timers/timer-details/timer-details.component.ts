import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";
import {AlertController, ModalController} from "@ionic/angular";
import {TimersService} from "../../core/timers.service";
import {FormControl} from "@angular/forms";
import {throttleTime} from "rxjs/operators";
import {ignorePromise} from "../../utils/promiseUtils";
import {throttleTimeWithLeadingTrailing} from "../../utils/rxUtils";

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
    this.timerTitleControl.valueChanges.pipe(throttleTimeWithLeadingTrailing(1000)).subscribe(titleValue => {
      this.timersService.patch(this.timer, {
        title: titleValue
      })
    })
  }

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
            ignorePromise(this.modalController.dismiss())
          }
        }
      ]
    })
    await alert.present()
  }
}
