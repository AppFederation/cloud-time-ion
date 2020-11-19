import { Injectable } from '@angular/core';
import {QuizAnswerForHistory} from './quiz-history.service'
import {QuizService} from './quiz.service'
import {msElapsedTillNowSince} from '../../../libs/AppFedShared/utils/time/time-utils'
import {debugLog} from '../../../libs/AppFedShared/utils/log'

@Injectable({
  providedIn: 'root'
})
export class QuizAnswersService {

  /** Answer being prepared */
  answer ? : QuizAnswerForHistory

  whenQuestionShowed ? : Date

  constructor(
    private quizService: QuizService,
  ) {
    this.quizService.quizStatus$.subscribe(status => {
      if ( status ?. nextItem$ ) {
        this.answer = new QuizAnswerForHistory()
        this.answer.itemId = status.nextItem$ !. id
        this.whenQuestionShowed = new Date()
        // FIXME: finish
      }
    })
  }

  onShowAnswer() {
    this.answer !. msToShowAnswer = msElapsedTillNowSince(this.whenQuestionShowed)
    debugLog(`onShowAnswer`, this.answer)
  }
}
