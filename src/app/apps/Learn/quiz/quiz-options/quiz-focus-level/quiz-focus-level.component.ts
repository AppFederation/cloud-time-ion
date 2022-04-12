import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {FormControl} from '@angular/forms'
import {QuizService} from '../../../core/quiz/quiz.service'

@Component({
  selector: 'app-quiz-focus-level',
  templateUrl: './quiz-focus-level.component.html',
  styleUrls: ['./quiz-focus-level.component.sass'],
})
export class QuizFocusLevelComponent implements OnInit {

  quizStatus$ = this.quizService.quizStatus$

  @Input()
  @Required()
  control ! : FormControl

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

  removeQuotes(s: string) {
    return s.replace(/"/g, '')
  }
}
