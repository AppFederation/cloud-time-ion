import {Dict, getDictionaryValuesAsArray} from '../utils/dictionary-utils';
import {questionsProblemsWishes} from './hints';
import {LiHintImpl} from './Hint';

export class QuestionsProblemsWishes {

  questionsProblemsWishes = questionsProblemsWishes

  asArray = getDictionaryValuesAsArray((this.questionsProblemsWishes as any) as Dict<LiHintImpl>)

}
