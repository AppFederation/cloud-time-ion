import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {map} from 'rxjs/operators'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem, LearnItem$} from '../models/LearnItem'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  public shouldShowAnswer = false
  dummyArray = [{}]

  selfRating: NumericPickerVal = undefined

  item$: LearnItem$

  dePrioritizeNewMaterial: boolean = true

  get item$$() {
    return this.quizService.getNextItemForSelfRating$(this.dePrioritizeNewMaterial)
  }

  constructor(
    public quizService: QuizService,
  ) {
  }

  ngOnInit() {
  }

  getSideValForQuiz$() {
    return this.item$$.pipe(map(item$ => {
      if ( this.item$ !== item$ ) {
        console.log(`getSideValForQuiz$ new item$`)
        setTimeout(() => {
          this.reset()
        })
      }
      this.item$ = item$
        //   this.item$ = item$
        //   // FIXME: this should improve a lot when I emit entire array changed (newly arrived), instead of each onAdded
        // })
        // console.log(`getSideValForQuiz$ this.item$$.pipe`)
        if (!item$) {
          return '(no item$)'
        }
        const item = item$.currentVal
        if (!item) {
          return '(none)'
        }
        for (let side of sidesDefsArray) {
          if (side.ask) {
            const sideVal = item[side.id]
            if (sideVal) {
              return sideVal
            }
          }
        }
        // second attempt, without `ask` requirement
        for (let side of sidesDefsArray) {
          const sideVal = item[side.id]
          if (sideVal) {
            return sideVal
          }
        }
      // }
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

  // onChangeSelfRating($event: NumericPickerVal) {
  // }
  applyAndNext() {
    this.reset()

    this.item$.setNewSelfRating(this.selfRating)
  }

  private reset() {
    this.shouldShowAnswer = false
    this.dummyArray = [{}]
  }
}
