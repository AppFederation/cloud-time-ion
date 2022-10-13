import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {QuizService} from './quiz.service'
import {requestNextQuizItem, requestNextQuizItemSuccess} from './quiz.actions'

@Injectable()
export class QuizEffects {

  fetchQuizItem$ = createEffect(() => this.actions$.pipe(
      ofType(requestNextQuizItem),
      mergeMap(() => {
        console.log('!!! ngrx QuizEffects mergeMap')

        return this.quizService.nextItem$WhenRequested
          .pipe(
            map(movies => {
              console.log('!!! ngrx QuizEffects success', movies)
              return ({
                type: /*requestNextQuizItemSuccess.name*/ '[Quiz] Next Item Success',
                // payload: {test: 'xyz'},
                payload: {test: movies?.id},
              })
            }),
            catchError(() => EMPTY),
          )
      })
    )//, { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private quizService: QuizService
  ) {}
}
