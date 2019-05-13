import {OdmItem} from "../odm/OdmItem";
import {TimersService} from "./timers.service";
import {OdmItemId} from "../odm/OdmItemId";
import {FIXME} from "../utils/log";

export type TimerId = OdmItemId

export class TimerItem extends OdmItem<TimerItem> {

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
    return !! this.endTime
  }

  constructor(
    timersService: TimersService,
    public id?,
    public endTime?: Date | undefined,
    public durationSeconds?: number,
    public title?: string,
  ) {
    super(timersService)
  }

  onSavedNow() {
    FIXME('call onSavedNow')
  }


  toDbFormat() {
    let toDbFormat = super.toDbFormat();
    if ( ! toDbFormat.endTime ) {
      delete toDbFormat.endTime // for firestore
    }
    return toDbFormat;
  }

  onModified() {
    super.onModified()
    if ( this.durationSeconds ) {
      this.endTime = new Date(Date.now() + this.durationSeconds * 1000)
    }
  }

}
