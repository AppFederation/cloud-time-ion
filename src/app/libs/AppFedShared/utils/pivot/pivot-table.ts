export class PivotTable<TItem, TVal, TDim1, TDim2, TAggregate = TVal>
{
  constructor(
    public items: TItem[],
    public valGetter,
    public dim1Getter,
    public dim2Getter,
    public aggregateFunc,
    // optionally could specify included/excluded dim vals
  ) {
  }

  public getAggregateVal(dim1: TDim1, dim2: TDim2) // : TAggregate
  {
    // we have the values stored for fast getting (e.g. for Angular)
  }

  /** for ngFor */
  public getDim1Vals() // : TDim1[]
  {

  }

  public getDim2Vals() // : TDim2[]
  {

  }
}
