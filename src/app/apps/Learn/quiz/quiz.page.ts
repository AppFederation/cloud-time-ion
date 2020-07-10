import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {map, switchMap} from 'rxjs/operators'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {Observable} from 'rxjs/internal/Observable'

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

  get itemVal$(): Observable<LearnItem> {
    return this.item$$.pipe(
      switchMap(item$ => {
        return item$.locallyVisibleChanges$
      })
    )
  }


  dePrioritizeNewMaterial: boolean = true
  onlyWithQA = false

  get item$$() {
    return this.quizService.getNextItemForSelfRating$(
      {
        dePrioritizeNewMaterial: this.dePrioritizeNewMaterial,
        onlyWithQA: this.onlyWithQA,
      }
    )
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
        if ( ! item$ ) {
          return '(Loading...)'
        }
        const item = item$.currentVal
        if ( ! item ) {
          return '(none)'
        }
        return item.getQuestionOrAnyString()
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
    this.shouldShowAnswer = ! this.shouldShowAnswer
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
