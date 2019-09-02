
export class OryColumn<TVal = any> {

  public get fieldName() { return this.name }

  constructor(
    public name: string
  ) {}

  getValueFromItemData(itemData: any) {
    return itemData[this.fieldName] as TVal
  }

  setValueOnItemData(itemData: any, value: TVal) {
    itemData[this.fieldName] = value
  }
}

