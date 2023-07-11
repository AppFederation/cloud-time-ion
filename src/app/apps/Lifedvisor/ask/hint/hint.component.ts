import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  LiHint, LiHintImpl,

} from '../../shared-with-testcafe/Hint';
import {Filter} from '../../shared-with-testcafe/text_search/Filter';

/** Hint, Wish, Problem / Question */
@Component({
  selector: 'app-hint[filter][wish]',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.css']
})
export class HintComponent implements OnInit {

  /** otherwise just qualities/problems */
  @Input() includeHintsInSearch: boolean = false

  /** FIXME move this logic out of component */
  @Input()
  isExpandedManually = false

  /** FIXME move this logic out of component */
  @Input()
  isExpandedRecursively = false

  @Input()
  filter: Filter = Filter.NONE

  @Input()
  wish ! : LiHintImpl

  /** FIXME move this logic out of component */
  @Input()
  ancestorMatchesFilter ? : boolean

  get isOnlyVisibleToShowChild() {
    return ! ( this.matchesFilter() || this.ancestorMatchesFilter )
  }

  get isAnyChildVisible() {
    return this.wish.ifYes ?. some(childWish => {
      return this.isVisibleViaFilter(childWish) && !childWish.isAtRoot
    })
  }

  debug = {
    showComponentName: true
  }

  static hintsCount = 0
  static hintsCountStrings = 0

  isCurrentHint = false

  isCollapsed = false

  get childrenToShow() {
    return this.isThisLevelExpandedFullyEffectively ? this.wish.ifYes : this.wish.ifYesSortedByScoreFiltered
  }

  get isThisLevelExpandedFullyEffectively() {
    return this.isExpandedManually || this.isExpandedRecursively
  }

  constructor() {
    HintComponent.hintsCount ++
    if ( HintComponent.hintsCount % 1 === 0 ) {
      // console.log('HintComponent.hintsCount', HintComponent.hintsCount)
    }
  }

  ngOnInit() {
  }

  onClickYes() {
    this.isExpandedManually = true
  }

  matchesFilter(): boolean {
    // return ( this.filter ?. trim() !== '') && this.wish.matchesFilter(this.filter)
    return this.wish.matchesFilter(this.filter)
  }

  isVisibleViaFilter(hint: LiHintImpl) {
    return hint.isVisibleViaFilter(this.filter)
  }

  isChildVisible(childHint: LiHintImpl) {
    return this.isVisibleViaFilter(childHint) || this.ancestorMatchesFilter // || this.matchesFilter()
    // return this.isVisibleViaFilter(childHint) || this.matchesFilter()
  }
}
