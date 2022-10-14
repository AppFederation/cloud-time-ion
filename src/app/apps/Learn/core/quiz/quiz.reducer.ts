import { createReducer, on } from '@ngrx/store';
import {requestNextQuizItem, requestNextQuizItemSuccess} from './quiz.actions'

// export const initialState = 1;
export const initialState = { quizItemId: undefined };

export const counterReducer = createReducer(
  initialState,
  on(requestNextQuizItemSuccess, (state, payload) => {
    console.log('ngrx counterReducer requestNextQuizItem', state, 'payload: ', payload)
    const newState = {
      ...state,
      quizItemId: (payload as any).payload.quizItemId
    }
    console.log('newState', newState)
    return newState
  }),
);

