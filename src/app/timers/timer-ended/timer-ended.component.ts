import {Component, Input, OnInit} from '@angular/core';
import {TimerId, TimerItem} from "../../core/TimerItem";
import {ignorePromise} from "../../libs/AppFedShared/utils/promiseUtils";
import {ModalController} from "@ionic/angular";
import {debugLog} from "../../libs/AppFedShared/utils/log";

@Component({
  selector: 'app-timer-ended',
  templateUrl: './timer-ended.component.html',
  styleUrls: ['./timer-ended.component.scss'],
})
export class TimerEndedComponent implements OnInit {

  @Input() timer ! : TimerItem

  // private static mapTimerToDialog = new Map<TimerId, TimerEndedComponent>()
  private static timerEndedDialogsSet = new Set<TimerId>()

  constructor(
    public modalController: ModalController,
  ) {
  }

  ngOnInit() {
    // TimerEndedComponent.mapTimerToDialog.set(this.timer.id, this)

    this.timer.locallyVisibleChanges$.subscribe(timerItem => {
      // TODO: should be throttled
      debugLog('TimerEndedComponent: locallyVisibleChanges$', timerItem)
      if ( ! timerItem.isRunning ) {
        this.dismiss()
      }
    })
  }

  onClickStopTimerAndDismiss() {
    this.timer.stopTimer()
    this.dismiss();
    // TODO: stop sounds when dismissed
  }

  onClickRestart() {
    this.timer.restartTimer()
    this.dismiss();
  }

  // TODO: dismiss automatically if dismissed/stopped on another device

  dismiss() {
    debugLog('dismiss ', this, this.timer)
    // TimerEndedComponent.mapTimerToDialog.delete(this.timer)
    TimerEndedComponent.timerEndedDialogsSet.delete(this.timer.id !)
    return ignorePromise(this.modalController.dismiss())
  }

  onClickPostponeOneMinute() {
    // TODO
  }

  static isDialogOpenForTimer(timerId: TimerId) {
    // return TimerEndedComponent.mapTimerToDialog.get(timerId) !== undefined;
    return TimerEndedComponent.timerEndedDialogsSet.has(timerId);
  }

  static addTimerDialog(timerId: TimerId) {
    // return TimerEndedComponent.mapTimerToDialog.get(timerId) !== undefined;
    return TimerEndedComponent.timerEndedDialogsSet.add(timerId);
  }

  static removeTimerDialog(timerId: TimerId) {
    TimerEndedComponent.timerEndedDialogsSet.delete(timerId)
  }
}
