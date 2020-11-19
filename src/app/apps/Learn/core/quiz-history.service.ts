import {Injectable, Injector} from '@angular/core';
import {HistoryService} from '../../../libs/AppFedShared/odm/history.service'
import {StoredLearnStats} from './learn-stats.service'
import {LearnItemId} from '../models/LearnItem'
import {OdmInMemItem, OdmInMemItemWriteOnce} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {Rating} from '../models/fields/self-rating.model'
import {QuizOptions} from './quiz.service'
import {DurationMs} from '../../../libs/AppFedShared/utils/type-utils'

export class QuizAnswerForHistory extends OdmInMemItemWriteOnce {

  itemId ! : LearnItemId

  /** Undefined will mean skipping */
  selfRating: Rating | undefined

  userAgent ? : string

  // deviceId: string
  // geo: ...
  // appVersion: ... (+timestamp)
  // importance: ImportanceVal
  // answer: HtmlString
  // quizDiligence: { powBase: number, id? : QuizDiligenceLevelId }

  quizOptions ? : QuizOptions

  msToShowAnswer ? : DurationMs
  msToSelfRate ? : DurationMs
  msToApplyAndNext ? : DurationMs

  // timeToAnswer: DurationMs

  // learnItem: LearnItemId
  // selfRating: Rating
  // could be also category

  // also stores:
  // - owner
  // - when created
  // - should not store when *modified* coz it's not modifying
}

/*
* This could also serve as a way to store/get ratings as non-owner (querying only the latest one)
* */
@Injectable({
  providedIn: 'root'
})
export class QuizHistoryService extends HistoryService<QuizAnswerForHistory> {

  constructor(
    protected injector: Injector,
  ) {
    super(
      injector,
      'QuizAnswersHistory',
      // {
      //   loadAll: false,
      // }
      // TODO: indicate to not load all items, to not slow down (especially on app start)
    )
  }

  onAnswer(param: QuizAnswerForHistory) {
    this.newValue(param)
  }
}
