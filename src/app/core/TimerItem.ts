export class TimerItem {

  timeoutSubscription: any

  get msLeft() {
    if ( ! this.endTime ) {
      return 0 // HACK
    }
    return this.endTime.getTime() - Date.now()
  }

  get secondsLeftInt() {
    return Math.round(this.msLeft/1000)
  }

  constructor(
    public id = 'timerId1',
    public endTime: Date | undefined,
    public durationSeconds: number,
    public title: string,
  ) {

  }

}
