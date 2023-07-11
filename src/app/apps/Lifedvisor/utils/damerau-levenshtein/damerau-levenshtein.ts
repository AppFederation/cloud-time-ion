/* tslint:disable:curly no-var-keyword */

import {isNullish} from '../utils';

/** https://www.davidhampgonsalves.com/javascript-damerau-levenshtein-algorithim/
 * can try https://github.com/fabvalaaah/damerau-levenshtein-js
 * can try weighted version for keyboard mistypes
 */
export function damerauLevenshteinDistanceRaw(source: string, target: string): number {
  if (!source || source.length === 0)
    if (!target || target.length === 0)
      return 0;
    else
      return target.length;
  else if (!target)
    return source.length;

  const sourceLength = source.length;
  const targetLength = target.length;
  const score = [];

  const INF = sourceLength + targetLength;
  score[0] = [INF];
  for (let i = 0 ; i <= sourceLength ; i++) { score[i + 1] = []; score[i + 1][1] = i; score[i + 1][0] = INF; }
  for (let i = 0 ; i <= targetLength ; i++) { score[1][i + 1] = i; score[0][i + 1] = INF; }

  const sd: any = {};
  const combinedStrings = source + target;
  const combinedStringsLength = combinedStrings.length;
  for ( let i = 0 ; i < combinedStringsLength ; i++ ) {
    const letter = combinedStrings[i];
    if (!sd.hasOwnProperty(letter))
      sd[letter] = 0;
  }

  for (let i = 1 ; i <= sourceLength ; i++) {
    let DB = 0;
    for (let j = 1 ; j <= targetLength ; j++) {
      const i1 = sd[target[j - 1]];
      const j1 = DB;

      if (source[i - 1] == target[j - 1]) {
        score[i + 1][j + 1] = score[i][j];
        DB = j;
      } else
        score[i + 1][j + 1] = Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) + 1;

      score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
    }
    sd[source[i - 1]] = i;
  }
  return score[sourceLength + 1][targetLength + 1];
}

// export function damerauLevenshteinDistance = memoize(damerauLevenshteinDistanceRaw, damerauLevenshteinDistanceCache, )
const memoizedMap = new Map<string, number>()

/** Relationship with other edit distance metrics
 Main article: Edit distance
 There are other popular measures of edit distance, which are calculated using a different set of allowable edit operations. For instance,

 the Damerau–Levenshtein distance allows the transposition of two adjacent characters alongside insertion, deletion, substitution;
 the longest common subsequence (LCS) distance allows only insertion and deletion, not substitution;
 the Hamming distance allows only substitution, hence, it only applies to strings of the same length.
 the Jaro distance allows only transposition.
 Edit distance is usually defined as a parameterizable metric calculated with a specific set of allowed edit operations, and each operation is assigned a cost (possibly infinite). This is further generalized by DNA sequence alignment algorithms such as the Smith–Waterman algorithm, which make an operation's cost depend on where it is applied.

 */
export function damerauLevenshteinDistance(source: string, target: string): number {
  const memKey = source + '__' + target;
  let memoizedVal = memoizedMap.get(memKey)
  if ( isNullish(memoizedVal) ) {
    memoizedVal = damerauLevenshteinDistanceRaw(source, target)
    memoizedMap.set(memKey, memoizedVal)
  }
  return memoizedVal
}
