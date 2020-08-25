import { Injectable } from '@angular/core';
import {LearnDoService} from './learn-do.service'
import {LearnItem$} from '../models/LearnItem$'
import {map, shareReplay} from 'rxjs/operators'
import {Observable} from 'rxjs/internal/Observable'

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
      return item$s ?. find(item$ => item$ ?. currentVal ?. needsProcessing())
    }, shareReplay(1)
    )
  )

  /* this later could be by category */
  public getNextItemToProcess(): LearnItem$ | undefined {

    const found = this.learnDoService.localItems$.lastVal ?. find(item$ => {
      return item$ ?. currentVal ?. needsProcessing()
    })
    console.log(`found`, found)
    return found
  }


}
