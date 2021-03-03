import { Component, OnInit } from '@angular/core';
import {QuizService} from '../../../core/quiz/quiz.service'
import {ImportanceDescriptor, importanceDescriptors, importanceDescriptorsArray} from '../../../models/fields/importance.model'
import {ImportanceVal} from '../../../models/LearnItem'
import {SelfRating} from '../../../models/fields/self-rating.model'

@Component({
  selector: 'app-quiz-intervals',
  templateUrl: './quiz-intervals.component.html',
  styleUrls: ['./quiz-intervals.component.sass'],
})
export class QuizIntervalsComponent implements OnInit {

  importances = importanceDescriptorsArray.filter(imp => !imp.isDebug)
  ratings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, /*7, 8, 9, 10*/]

  hiLightCell = {
    importance: importanceDescriptors.medium,
    selfRating: 2
  }

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {}

  getIntervalDays(rating: number, importance: ImportanceVal) {
    return this.quizService.calculateIntervalMs(rating, importance) / 24 / 3600 / 1000
  }

  isHilight(importance: ImportanceDescriptor, rating: SelfRating) {
    return this.hiLightCell.importance.id === importance.id
      || this.hiLightCell.selfRating === rating
  }
}
