import { createReducer, on } from '@ngrx/store';
import {requestNextQuizItem, requestNextQuizItemSuccess} from './quiz.actions'

export const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(requestNextQuizItemSuccess, (state) => {
    console.log('ngrx counterReducer requestNextQuizItem', state)
    return state + 1
  }),
);

