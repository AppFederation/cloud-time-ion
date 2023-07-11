import {SearchableText, SearchableText3} from './SearchableText';
import {Filter} from './Filter';
import {sumBy} from 'lodash-es';
import {damerauLevenshteinDistance} from '../../utils/damerau-levenshtein/damerau-levenshtein';
import {wordSimilarity} from './wordSimilarity';

export function textMatchScore(searchIn: SearchableText | null | undefined, searched: Filter): number {
  // could boost the score if the string is exactly the same; and maybe if one string is subset of the other (for prefix/suffix)

  // TODO: normalize Levenshtein to be score=1 if exact, score zero if distance equal to string(which?) length
  // fail: craving -> planning

  if (!searchIn) {
    return 0;
  }
  searchIn = searchIn?.toLowerCase() ?? '';
  if (!searchIn) {
    return 0;
  }

  const searchableText = SearchableText3.fromString(searchIn);
  // console.log(`searchableText`, searchableText)
  // searched = escapeRegExp(searched) // move to Filter
  // const stringsSplit = searched.split(' ')

  return sumBy(searched.wordsNormalized, searchedWord => sumBy(
    // searchableText.wordsNormalized, sourceWord => 1 / (damerauLevenshteinDistance(searchedWord, sourceWord) + 1) // / ( searchedWord.length + sourceWord.length)
    searchableText.wordsNormalized, sourceWord => wordSimilarity(searchedWord, sourceWord) // / ( searchedWord.length + sourceWord.length)
  )) / searchableText.wordsNormalized.length // / searchIn.length // / searched.wordsNormalized.length / searchableText.wordsNormalized.length;

  // return sumBy(searched.wordsEscapedAsRegexpLowerCase, curString => {
  //   const isMatching = (searchIn as string).match(curString);
  //   if (isMatching) {
  //     return 1 / (searchIn as string)?.length;
  //   } else {
  //     return 0;
  //   }
  // });
  //every(curString => !! ((searchIn as string).match(curString.trim().toLowerCase())))
}
