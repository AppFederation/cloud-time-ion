import { Injectable } from '@angular/core';
import {LearnItemItemsService} from './learn-item-items.service'
import {LearnItem$} from '../models/LearnItem$'
import {map, shareReplay} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {findPreferred} from '../../../libs/AppFedShared/utils/cachedSubject2/collectionUtils'
import {countBy} from 'lodash-es'
import {LearnItem} from '../models/LearnItem'

@Injectable({
  providedIn: 'root'
})
export class ItemProcessingService {

  constructor(
    private learnDoService: LearnItemItemsService,
  ) {
    console.log('ItemProcessingService service constructor')
  }

  nextItemToProcess$: Observable<LearnItem$ | undefined> = this.learnDoService.localItems$.pipe(
      map(item$s => {
        // return item$s ?. find(item$ => item$ ?. currentVal ?. needsProcessing())
        return this.findItemForProcessing(item$s)

      }, shareReplay(1)
    )
  )

  private findItemForProcessing(item$s?: LearnItem$[]): LearnItem$ | undefined {
    if ( ! item$s ) {
      return undefined
    }
    return findPreferred(item$s,
      // item$ => item$?.currentVal?.hasAudio ?? false,
      item$ => item$?.currentVal?.needsProcessing() ?? false,
      // item$ => true,
      [
        (item$1, item$2) => item$2.getEffectiveImportanceNumeric() - item$1.getEffectiveImportanceNumeric(),
        (item$1, item$2) => (item$2?.currentVal?.hasAudio ? 1 : 0) - (item$1?.currentVal?.hasAudio ? 1 : 0),
      ]
    )
  }

  /* this later could be by category */
  public getNextItemToProcess(): LearnItem$ | undefined {

    const found = this.findItemForProcessing(this.learnDoService.localItems$.lastVal)
    console.log(`found`, found)
    return found
  }

  public getCountsByImportance() {
    return countBy(
      this.getItemsNeedingProcessing() ?? [],
      (item$: LearnItem$) => item$.getEffectiveImportanceShortId()
    )
  }

  public getItemsNeedingProcessing() {
    return this.learnDoService.localItems$.lastVal?.filter(
      item => item.currentVal?.needsProcessing()
    )
  }

  getCountNeedingProcessing() {
    return this.getItemsNeedingProcessing()?.length
  }
}
