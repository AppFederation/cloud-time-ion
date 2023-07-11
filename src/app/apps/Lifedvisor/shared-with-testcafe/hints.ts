import {hint, LiHint, LiHintImpl} from './Hint';
import { Questions } from './hints_problems_questions_public.data';

function processQuestions(questions: Questions) {
  const keys = Object.keys(questions) as any as keyof Questions;
  const questionsMap = questions as any as ({ [key: string]: LiHint });
  for ( const key of keys ) {
    let value = questionsMap[key];
    if ( ! value ) {
      value = {}
      questionsMap[key] = value
    }
    value.text = value.text || key
    value.id = value.id || key
    value.isAtRoot = true
  }
  return questions
}

export const questionsProblemsWishes = processQuestions(new Questions());

export const rootHint: LiHintImpl = hint({
  title: `root hint`,
  ifYes: [
    ... Object.values(questionsProblemsWishes)
  ]
})
