import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {
  }

}
