import {QuestionsProblemsWishes} from '../shared-with-testcafe/QuestionsProblemsWishes';
import {Filter} from '../shared-with-testcafe/text_search/Filter';
import {rootHint} from '../shared-with-testcafe/hints';
import {sortBy} from 'lodash-es';
import {LiHintImpl} from '../shared-with-testcafe/Hint';

/*
* bad cases:
* - "sleep" - sleeping - stepping
* - bored - Get better at doing things
* */
export class HintFinder {

  rootHint = rootHint

  static instance = new HintFinder()

  public questionsProblemsWishes = new QuestionsProblemsWishes()

  constructor(

  ) {}

  applySearch(filter: Filter) {
    // this.recursively(hint => {
    //   hint.appliedFilter = undefined
    //   hint.searchScore = undefined
    // })
    // this.assignScoreRecursively(filter, this.rootHint)
    this.sortByScoreRecursively(filter, this.rootHint)
    // console.log(`this.rootHint.ifYesSortedByScoreFiltered`, this.rootHint.ifYesSortedByScoreFiltered)
    // TODO: recursively
  }

  private sortByScoreRecursively(filter: Filter, hint: LiHintImpl) {
    hint.ifYesSortedByScoreFiltered =
      sortBy(hint.ifYes, subHint => {
        const score = subHint.getScoreForFilter(filter).score;
        // console.log('score', score, hint)
        return - score
      }) ?? []
    if ( hint.ifYes ) {
      for ( const subHint of hint.ifYes ) {
        this.sortByScoreRecursively(filter, subHint)
      }
    }
  }

  // private assignScoreRecursively(filter: Filter, startHint: LiHintImpl) {
  //   startHint.getScoreForFilter(filter)
  //   if ( hint.ifYes ) {
  //     for ( const subHint of hint.ifYes ) {
  //       this.assignScoreRecursively(filter, subHint)
  //     }
  //   }
  // }

  private recursively(func: (hint: LiHintImpl) => void) {
    this.recursively1(this.rootHint, func)
  }

  private recursively1(startHint: LiHintImpl, func: (hint: LiHintImpl) => void) {
    func(startHint)
    if ( startHint.ifYes ) {
      for ( const subHint of startHint.ifYes ) {
        this.recursively1(subHint, func)
      }
    }
  }
}
