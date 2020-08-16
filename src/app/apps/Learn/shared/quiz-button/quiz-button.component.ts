import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../core/quiz.service'

@Component({
  selector: 'app-quiz-button',
  templateUrl: './quiz-button.component.html',
  styleUrls: ['./quiz-button.component.sass'],
})
export class QuizButtonComponent implements OnInit {

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

}
