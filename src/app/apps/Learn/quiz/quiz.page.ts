import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {map} from 'rxjs/operators'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  private shouldShowAnswer = false

  get item$() {
    return this.quizService.getNextItemForSelfRating$()
  }

  constructor(
    public quizService: QuizService,
  ) { }

  ngOnInit() {
  }

  getSideValForQuiz$() {
    return this.item$.pipe(map(item$ => {
      if ( ! item$ ) {
        return '(no item$)'
      }
      const item = item$.currentVal
      if ( ! item ) {
        return '(none)'
      }
      for ( let side of sidesDefsArray ) {
        if ( side.ask ) {
          const sideVal = item[side.id]
          if ( sideVal ) {
            return sideVal
          }
        }
      }
      // second attempt, without `ask` requirement
      for ( let side of sidesDefsArray ) {
        const sideVal = item[side.id]
        if ( sideVal ) {
          return sideVal
        }
      }
    }))
  }

  nowMs() {
    return Date.now()
  }

  newDate(number: number) {
    return new Date(number)
  }

  showAnswer() {
    this.shouldShowAnswer = true
  }
}
