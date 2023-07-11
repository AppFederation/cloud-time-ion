import {damerauLevenshteinDistance} from '../../utils/damerau-levenshtein/damerau-levenshtein';

export function wordSimilarity(word1: string, word2: string): number {
  // consider reading https://medium.com/@adriensieg/text-similarities-da019229c894
  word1 = word1.toLowerCase() // temporary
  word2 = word2.toLowerCase()

  const dist = damerauLevenshteinDistance(word1, word2);
  // can consider removing non-words tokens, like "/"

  // can do common suffixes, like "ing", "ion", '-ed"
  // https://www.learnthat.org/pages/view/suffix.html

  if ( dist > 1/*5*/) {
    return 0 // that should be generous enough to include common endings; as well as misspellings
    // but: priority => prioritizing : 5, so should be more lenient for longer words
  }

  if ( dist >= word1.length || dist >= word2.length) {
    return 0;
  }
  if ( dist === 0 ) {
    return 1 // max similarity
  }
  const relativeDistance = dist / (word1.length + word2.length);
  return (1 / (relativeDistance + 1))
}
