import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../../core/quiz.service'

@Component({
  selector: 'app-quiz-intervals',
  templateUrl: './quiz-intervals.component.html',
  styleUrls: ['./quiz-intervals.component.sass'],
})
export class QuizIntervalsComponent implements OnInit {

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

}
