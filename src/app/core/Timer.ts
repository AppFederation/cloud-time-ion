export class Timer {

  constructor(
    public id = 'timerId1',
    public endTime: Date | undefined,
    public durationSeconds: number,
    public title: string,
  ) {}

}
