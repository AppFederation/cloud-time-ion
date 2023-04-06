import {Injectable, Injector} from '@angular/core';
import { TimerItem } from './TimerItem';
import {OdmService_OLD} from "../libs/AppFedShared/odm/OdmService_OLD";

@Injectable()
export class TimersService extends OdmService_OLD<TimerItem> {

  timers$ = this.localItems$

  constructor(
      injector: Injector,
  ) {
    super(injector, 'Timer')
  }

  protected override convertFromDbFormat(dbTimer: TimerItem) {
    const timerInstance = Object.assign(new TimerItem(this), dbTimer);
    timerInstance.endTime =
      timerInstance.endTime &&
      (timerInstance.endTime as any).toDate()
    return timerInstance
  }

}
