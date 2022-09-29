import { createReducer, on } from '@ngrx/store';
import {requestNextQuizItem} from './quiz.actions'

export const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(requestNextQuizItem, (state) => {
    console.log('counterReducer requestNextQuizItem', state)
    return state + 1
  }),
);

