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

  // deviceId: string --> userAgent
  // geo: ...
  // appVersion: ... (+timestamp) +git describe [--tags]
  // TODO importance: ImportanceVal
  // TODO fun
  // TODO mental level
  // answer: HtmlString
  // quizDiligence: { powBase: number, id? : QuizDiligenceLevelId }


  quizOptions ? : QuizOptions

  msToShowHint ? : DurationMs
  msToShowAnswer ? : DurationMs
  msToSelfRate ? : DurationMs
  msToApplyAndNext ? : DurationMs

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
    )
  }

  onAnswer(param: QuizAnswerForHistory) {
    this.newValue(param)
  }
}
