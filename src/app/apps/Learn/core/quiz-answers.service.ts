import { Injectable } from '@angular/core';
import {QuizAnswerForHistory} from './quiz-history.service'
import {QuizService} from './quiz.service'

@Injectable({
  providedIn: 'root'
})
export class QuizAnswersService {

  answerBeingPrepared ? : QuizAnswerForHistory

  whenQuestionShowed ? : Date

  constructor(
    private quizService: QuizService,
  ) {
    this.quizService.quizStatus$.subscribe(status => {
      this.answerBeingPrepared = new QuizAnswerForHistory()
      this.answerBeingPrepared.itemId = status.nextItem$.id
      this.whenQuestionShowed = new Date()
      // FIXME: finish
    })
  }
}
