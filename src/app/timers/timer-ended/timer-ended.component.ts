import {Component, Input, OnInit} from '@angular/core';
import {TimerItem} from "../../core/TimerItem";
import {ignorePromise} from "../../utils/promiseUtils";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-timer-ended',
  templateUrl: './timer-ended.component.html',
  styleUrls: ['./timer-ended.component.scss'],
})
export class TimerEndedComponent implements OnInit {

  @Input() timer: TimerItem

  constructor(
    public modalController: ModalController,
  ) { }

  ngOnInit() {}

  onClickDismiss() {
    this.timer.stopTimer()
    this.dismiss();

    // TODO: stop sounds when dismissed

  }

  onClickRestart() {
    this.timer.restartTimer()
    this.dismiss();
  }

  // TODO: dismiss automatically if dismissed/stopped on another device

  private dismiss() {
    return ignorePromise(this.modalController.dismiss())
  }

  onClickPostponeOneMinute() {
    // TODO
  }
}
