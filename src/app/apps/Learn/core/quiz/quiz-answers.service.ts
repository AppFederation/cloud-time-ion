import { Injectable } from '@angular/core';
import {QuizAnswerForHistory, QuizHistoryService} from './quiz-history.service'
import {QuizService} from './quiz.service'
import {msElapsedTillNowSince} from '../../../../libs/AppFedShared/utils/time/date-time-utils'
import {catchReportDontRethrow, debugLog} from '../../../../libs/AppFedShared/utils/log'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../../models/LearnItem$'
import {SelfRating} from '../../models/fields/self-rating.model'
import {WhatNextService} from '../../../../shared/scheduler/what-next.service'


@Injectable({
  providedIn: 'root'
})
export class QuizAnswersService {

  /** Answer being prepared */
  answer ? : QuizAnswerForHistory

  whenQuestionShowed ? : Date

  constructor(
    private quizService: QuizService,
    private quizHistoryService: QuizHistoryService,
    private whatNextService: WhatNextService,
  ) {
    this.quizService.quizStatus$.subscribe(status => {
      if ( status ?. nextItem$ ) {
        this.answer = new QuizAnswerForHistory()
        this.answer.itemId = status.nextItem$ !. id !
        this.answer.userAgent = navigator.userAgent
        this.whenQuestionShowed = new Date()
        // FIXME: finish
      }
    })
  }

  onShowAnswer() {
    this.answer !. msToShowAnswer = this.getMsSinceQuestionShowed()
    debugLog(`onShowAnswer`, this.answer)
  }

  onShowHint() {
    this.answer !. msToShowHint = this.getMsSinceQuestionShowed()
  }

  onSelfRate() {
    this.answer !. msToSelfRate = this.getMsSinceQuestionShowed()
  }


  private getMsSinceQuestionShowed() {
    if ( this.whenQuestionShowed ) {
      return msElapsedTillNowSince(this.whenQuestionShowed !)
    } else {
      return 0
    }
  }

  onApplyAndNext(item$: LearnItem$, selfRating: NumericPickerVal) {
    this.storeAnswerForHistory(selfRating)
    item$ ?. setNewSelfRating(selfRating !)
    this.whatNextService.whatNext()
    this.quizService.requestNextItem()
  }

  private storeAnswerForHistory(selfRating: number) {
    catchReportDontRethrow('storeAnswerForHistory', () => {
      this.answer !.quizOptions = Object.assign({}, this.quizService.options$.lastVal !)
      this.answer !.msToApplyAndNext = this.getMsSinceQuestionShowed()
      this.answer !.selfRating = selfRating as SelfRating

      this.quizHistoryService.onAnswer(
        this.answer !,
      )
    })
  }

}
