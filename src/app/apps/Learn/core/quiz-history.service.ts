import {Injectable, Injector} from '@angular/core';
import {HistoryService} from '../../../libs/AppFedShared/odm/history.service'
import {StoredLearnStats} from './learn-stats.service'
import {LearnItemId} from '../models/LearnItem'
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {Rating} from '../models/fields/self-rating.model'

export class QuizAnswer extends OdmInMemItem {
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
export class QuizHistoryService extends HistoryService<QuizAnswer> {

  constructor(
    protected injector: Injector,
  ) {
    super(
      injector,
      'QuizHistory',
      // {
      //   loadAll: false,
      // }
      // TODO: indicate to not load all items, to not slow down (especially on app start)
    )
  }
}
