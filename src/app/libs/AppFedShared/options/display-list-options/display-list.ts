export class DisplayList {
  private constructor(public id: string,
              public name: string) {
  }

  public static displayLists = [
      new DisplayList("ionic-virtual-list", "Ionic List"),
      new DisplayList("simple-list", "Simple list"),
      new DisplayList("virtual-list", "Virtual list")
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
