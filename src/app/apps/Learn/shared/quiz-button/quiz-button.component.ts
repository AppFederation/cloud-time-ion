import {Component, Injector, OnInit} from '@angular/core';
import {QuizService} from '../../core/quiz/quiz.service'
import {BaseComponent} from '../../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-quiz-button',
  templateUrl: './quiz-button.component.html',
  styleUrls: ['./quiz-button.component.sass'],
})
export class QuizButtonComponent extends BaseComponent implements OnInit {

  constructor(
    public quizService: QuizService,
    injector: Injector,
  ) {
    super(injector)
  }

  ngOnInit() {}

}
