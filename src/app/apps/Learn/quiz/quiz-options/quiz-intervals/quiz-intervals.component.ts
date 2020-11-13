import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../../core/quiz.service'
import {importanceDescriptorsArray} from '../../../models/fields/importance.model'
import {ImportanceVal} from '../../../models/LearnItem'

@Component({
  selector: 'app-quiz-intervals',
  templateUrl: './quiz-intervals.component.html',
  styleUrls: ['./quiz-intervals.component.sass'],
})
export class QuizIntervalsComponent implements OnInit {

  importances = importanceDescriptorsArray
  ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, /*7, 8, 9, 10*/]

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

  getIntervalDays(rating: number, importance: ImportanceVal) {
    return this.quizService.calculateIntervalMs(rating, importance) / 24 / 3600 / 1000
  }
}
