import {Component, Input, OnInit} from '@angular/core';
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem, LearnItem$} from '../../models/LearnItem'
import {Observable} from 'rxjs/internal/Observable'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'

@Component({
  selector: 'app-quiz-item-details',
  templateUrl: './quiz-item-details.component.html',
  styleUrls: ['./quiz-item-details.component.sass'],
})
export class QuizItemDetailsComponent implements OnInit {

  public shouldShowAnswer = false

  selfRating: NumericPickerVal | undefined = undefined

  @Input()
  item$ ? : LearnItem$ | null

  get itemVal$(): Observable<LearnItem | undefined | null> | undefined {
    return this.item$ ?. locallyVisibleChanges$
  }

  constructor() {
    debugLog('QuizItemDetailsComponent ctor')
  }

  ngOnInit() {}

  showAnswer() {
    this.shouldShowAnswer = ! this.shouldShowAnswer
  }

  // onChangeSelfRating($event: NumericPickerVal) {
  // }
  applyAndNext() {
    this.reset()

    this.item$ ?. setNewSelfRating(this.selfRating !)
  }

  private reset() {
    this.shouldShowAnswer = false
  }
}
