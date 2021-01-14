export class DisplayList {
  private constructor(public id: string,
              public name: string) {
  }

  public static displayLists = [
      new DisplayList("ionic-virtual-list", "Ionic Virtual List"),
      new DisplayList("simple-list", "Simple list"),
      new DisplayList("cdk-virtual-list", " Cdk Virtual list"),
      new DisplayList("intersection-observer-list", "IObserver list")
  ];

  public static findById(id: string) {
    for (let list of this.displayLists) {
      if (list.id === id) {
        return list;
      }
    }
    return this.displayLists[0];
  }
}
