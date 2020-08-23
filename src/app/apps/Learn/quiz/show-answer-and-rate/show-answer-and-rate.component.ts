import {Component, Input, OnInit} from '@angular/core';
import {QuizService} from '../../core/quiz.service'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../../models/LearnItem$'

@Component({
  selector: 'app-show-answer-and-rate',
  templateUrl: './show-answer-and-rate.component.html',
  styleUrls: ['./show-answer-and-rate.component.sass'],
})
export class ShowAnswerAndRateComponent implements OnInit {

  @Input() item$ ? : LearnItem$

  public selfRating: NumericPickerVal | undefined = undefined

  get showAnswer$() { return this.quizService.showAnswer$ }

  get showHint$() { return this.quizService.showHint$ }

  get quizStatus$() { return this.quizService.quizStatus$ }

  constructor(
    public quizService: QuizService,
  ) { }


  ngOnInit() {}

  showAnswer() {
    this.quizService.toggleShowAnswer()
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
    this.item$ ?. setNewSelfRating(this.selfRating !)
  }

}
