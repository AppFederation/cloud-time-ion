import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { HintFinder } from './HintFinder';
import {questionsProblemsWishes, rootHint} from '../shared-with-testcafe/hints';
import {SearchService} from '../core/search.service';
import {LiHintImpl} from '../shared-with-testcafe/Hint';
import {Filter} from '../shared-with-testcafe/text_search/Filter';
import {sortBy} from 'lodash-es';

@Component({
  selector: 'app-ask-page',
  templateUrl: './ask.page.html',
  styleUrls: ['./ask.page.scss']
})
export class AskPage implements OnInit {

  rootHint = rootHint

  textField = ''
  textFieldDummy = ''

  filter = Filter.NONE

  get filteredProblems(): LiHintImpl[] {
    return sortBy(Object.values(questionsProblemsWishes), (hint: LiHintImpl) => - hint.getScoreForFilter(this.filter))
  }

  isExpandAll = false /* better for debugging */

  filterToThrottle$ = new EventEmitter<string>()

  hintFinder = HintFinder.instance

  constructor(
    public searchService: SearchService,

  ) {
    this.filterToThrottle$.pipe(
      debounceTime(300)
    ).subscribe(search => {
      this.textField = search
      this.filter = Filter.fromString(this.textField ?? '')
      this.hintFinder.applySearch(Filter.fromString(search))
    })

    this.filterToThrottle$.pipe(
      debounceTime(1000)
    ).subscribe(search => {
      this.searchService.onSearchConfirmed(search)
    })
  }

  ngOnInit() {
  }

  onChangeFilterText(ev: any) {
    // console.log('ev', ev)
    if ( typeof ev === 'string' ) {
      this.textField = ev
      // this.filteredProblems = this.hintFinder.getFilteredHints(ev)
      this.filterToThrottle$.emit(ev)
    }
  }

  isVisibleViaFilter(hint: LiHintImpl) {
    // return hint.isVisibleViaFilter(Filter.fromString(this.textField))
    return hint.isVisibleViaFilter(this.filter)
  }
}
