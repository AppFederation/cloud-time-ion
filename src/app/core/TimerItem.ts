import {OdmItem__OLD__} from "../libs/AppFedShared/odm/OdmItem__OLD__";
import {TimersService} from "./timers.service";
import {OdmItemId} from "../libs/AppFedShared/odm/OdmItemId";
import {FIXME} from "../libs/AppFedShared/utils/log";

export type TimerId = OdmItemId

export class TimerItem extends OdmItem__OLD__<TimerItem> {

  get msLeft() {
    if ( ! this.endTime ) {
      return 0 // HACK
    }
    return this.endTime.getTime() - Date.now()
  }

  get secondsLeftInt() {
    return Math.round(this.msLeft/1000)
  }

  get isRunning() {
    return ! this.isDeleted && !! this.endTime
  }

  get isRunningAndOverdue() {
    return this.isRunning && this.msLeft < 0
  }

  constructor(
    timersService: TimersService,
    /*public*/ id?: TimerId,
    public endTime?: Date | null | undefined,
    public durationSeconds?: number,
    public title?: string,
  ) {
    super(timersService)
  }

  onSavedNow() {
    FIXME('call onSavedNow')
  }


  override toDbFormat() {
    let toDbFormat = super.toDbFormat();
    if ( ! toDbFormat.endTime ) {
      delete toDbFormat.endTime // for firestore
    }
    return toDbFormat;
  }

  override onModified() {
    super.onModified()
  }

  stopTimer() {
    this.patchNow({
      endTime: null,
    })
  }

  startTimer() {
    this.patchNow({
      endTime: new Date(Date.now() + (this.durationSeconds ?? 0) * 1000)
    })
  }

  restartTimer() {
    this.stopTimer()
    this.startTimer()
  }
}
