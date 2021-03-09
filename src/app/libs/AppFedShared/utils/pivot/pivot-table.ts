export class PivotTable<TItem, TVal, TDim1, TDim2, TAggregate = TVal>
{
  constructor(
    public items: TItem[],
    public valGetter,
    public dim1Getter,
    public dim2Getter,
    public aggregateFunc,
  ) {
  }

  public getAggregateVal(dim1: TDim1, dim2: TDim2) // : TAggregate
  {
    // we have the values stored for fast getting (e.g. for Angular)
  }
}
