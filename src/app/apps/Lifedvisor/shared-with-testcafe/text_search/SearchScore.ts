export class SearchScore {

  static ZERO: SearchScore = new SearchScore(0);

  public constructor(
      public score: number,
  ) {
  }
}
