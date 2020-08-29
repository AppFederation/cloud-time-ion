import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {LearnItem$} from '../models/LearnItem$'
import {map, shareReplay} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'
import {findPreferred} from '../../../libs/AppFedShared/utils/cachedSubject2/collectionUtils'

@Injectable({
  providedIn: 'root'
})
export class ItemProcessingService {

  constructor(
    private learnDoService: LearnDoService,
  ) {
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
      item$ => item$?.currentVal?.hasAudio ?? false,
    )
  }

  /* this later could be by category */
  public getNextItemToProcess(): LearnItem$ | undefined {

    const found = this.findItemForProcessing(this.learnDoService.localItems$.lastVal)
    console.log(`found`, found)
    return found
  }


}
