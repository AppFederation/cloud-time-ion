import {Component, Input, OnInit} from '@angular/core';
import {QuizService} from '../../core/quiz.service'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../../models/LearnItem$'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {QuizHistoryService} from '../../core/quiz-history.service'
import {QuizAnswersService} from '../../core/quiz-answers.service'

@Component({
  selector: 'app-show-answer-and-rate',
  templateUrl: './show-answer-and-rate.component.html',
  styleUrls: ['./show-answer-and-rate.component.sass'],
})
export class ShowAnswerAndRateComponent implements OnInit {

  @Input() item$ ? : LearnItem$ | nullish

  public selfRating: NumericPickerVal | undefined = undefined

  get showAnswer$() { return this.quizService.showAnswer$ }

  get showHint$() { return this.quizService.showHint$ }

  get quizStatus$() { return this.quizService.quizStatus$ }

  constructor(
    public quizService: QuizService,
    public quizHistoryService: QuizHistoryService,
    public quizAnswersService: QuizAnswersService,
  ) { }


  ngOnInit() {}

  showAnswer() {
    this.quizService.toggleShowAnswer()
    this.quizAnswersService.onShowAnswer()
    // https://www.w3schools.com/jsref/met_element_scrollintoview.asp
    // this.scrollToBottom()
    // window.scrollTo(0,document.body.scrollHeight);
    // window.scrollTo(0,document.querySelector(".scrollingContainer").scrollHeight);
  }

  showHint() {
    this.quizService.toggleShowHint()
  }

  // onChangeSelfRating($event: NumericPickerVal) {
  // }

  applyAndNext() {
    this.quizAnswersService.onApplyAndNext(this.item$ !, this.selfRating !)
  }

}
