export class AggregateValue<TVal> {
  constructor(
    public aggregateVal: TVal,
    public numMissingVals: number,
  ) {}
}
