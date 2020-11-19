import { Injectable } from '@angular/core';
import {QuizAnswerForHistory, QuizHistoryService} from './quiz-history.service'
import {QuizService} from './quiz.service'
import {msElapsedTillNowSince} from '../../../libs/AppFedShared/utils/time/time-utils'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../models/LearnItem$'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

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
    this.answer !. msToShowAnswer = msElapsedTillNowSince(this.whenQuestionShowed !)
    debugLog(`onShowAnswer`, this.answer)
  }

  onApplyAndNext(item$: LearnItem$, selfRating: NumericPickerVal) {
    this.answer !. quizOptions = this.quizService.options$.lastVal !
    this.answer !. msToApplyAndNext = msElapsedTillNowSince(this.whenQuestionShowed !)
    this.answer !. selfRating = selfRating

    this.quizHistoryService.onAnswer(
      this.answer !
    )
    item$ ?. setNewSelfRating(selfRating !)
    this.quizService.requestNextItem()
  }
}