import {Injector} from "@angular/core";

export class NotificationInfo {
  constructor(
    public title: string,
    public when: Date,
  ) {}
}

export abstract class NotificationHandle {
  protected constructor(
    public notificationInfo: NotificationInfo,
  ) {}
}


export abstract class PlatformNotificationsService <THandle extends NotificationHandle> {
  constructor(protected injector: Injector) {

  }

  abstract scheduleNotificationImpl(notifInfo: NotificationInfo): THandle
  abstract cancelNotificationImpl(notifHandle: THandle)
}

