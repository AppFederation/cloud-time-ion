import {Injectable, Injector} from '@angular/core';
import { TimerItem } from './TimerItem';
import {OdmService} from "../libs/AppFedShared/odm/OdmService";

@Injectable()
export class TimersService extends OdmService<TimerItem> {

  timers$ = this.localItems$

  constructor(
      injector: Injector,
  ) {
    super(injector, 'Timer')
  }

  protected convertFromDbFormat(dbTimer: TimerItem) {
    const timerInstance = Object.assign(new TimerItem(this), dbTimer);
    timerInstance.endTime =
      timerInstance.endTime &&
      (timerInstance.endTime as any).toDate()
    return timerInstance
  }

}
