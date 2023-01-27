import {Component, Input, OnInit} from '@angular/core';
import {QuizService} from '../../core/quiz/quiz.service'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../../models/LearnItem$'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {QuizHistoryService} from '../../core/quiz/quiz-history.service'
import {QuizAnswersService} from '../../core/quiz/quiz-answers.service'
import {Store} from '@ngrx/store'
import {requestNextQuizItem} from '../../core/quiz/quiz.actions'
import {BaseComponent} from '../../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-show-answer-and-rate',
  templateUrl: './show-answer-and-rate.component.html',
  styleUrls: ['./show-answer-and-rate.component.sass'],
})
export class ShowAnswerAndRateComponent extends BaseComponent implements OnInit {

  @Input() item$ ? : LearnItem$ | nullish

  public selfRating: NumericPickerVal | undefined = undefined

  hide = false

  get showAnswer$() { return this.quizService.showAnswer$ }

  get showHint$() { return this.quizService.showHint$ }

  get quizStatus$() { return this.quizService.quizStatus$ }

  quizSelector$ = this.store.select(store => {
    console.log('store select', store)
    return store.count.quizItemId
  })

  constructor(
    public quizService: QuizService,
    public quizHistoryService: QuizHistoryService,
    public quizAnswersService: QuizAnswersService,
    private store: Store<{count: {quizItemId: {}}}>,
  ) { super() }


  ngOnInit() {
    this.showAnswer$.subscribe(showAnswer => {
      this.hide = ! showAnswer
    })
  }

  showAnswer() {
    this.quizService.toggleShowAnswer()
    this.quizAnswersService.onShowAnswer() // TODO maybe move to quizService. ...
    // https://www.w3schools.com/jsref/met_element_scrollintoview.asp
    // this.scrollToBottom()
    // window.scrollTo(0,document.body.scrollHeight);
    // window.scrollTo(0,document.querySelector(".scrollingContainer").scrollHeight);
  }

  showHint() {
    this.quizService.toggleShowHint()
    this.quizAnswersService.onShowHint() // TODO maybe move to quizService. ...
  }

  // onChangeSelfRating($event: NumericPickerVal) {
  // }

  applyAndNext() {
    this.quizAnswersService.onApplyAndNext(this.item$ !, this.selfRating !)
    this.store.dispatch(requestNextQuizItem())
  }

  toggleHide() {
    this.hide = ! this.hide

  }
}
