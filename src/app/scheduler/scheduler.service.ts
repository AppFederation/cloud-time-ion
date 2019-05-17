import { Injectable } from '@angular/core';
import {SchedulerModule} from "./scheduler.module";

export class SchedulerHandle {

  constructor(
    public _timeOutHandle
  ) {}

}

@Injectable({
  providedIn: SchedulerModule
})
export class SchedulerService {

  constructor() { }

  schedule(when: Date, callback: () => void): SchedulerHandle {
    const timeoutHandle = setTimeout(() => {
      callback()
    }, when.getTime() - Date.now())
    return new SchedulerHandle(timeoutHandle)
  }

  unSchedule(schedulerHandle: SchedulerHandle) {
    clearInterval(schedulerHandle._timeOutHandle)
  }
}
