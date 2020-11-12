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

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

  getIntervalDays(rating: number, importance: ImportanceVal) {
    return this.quizService.calculateIntervalHours2(rating, importance) / 24
  }
}
