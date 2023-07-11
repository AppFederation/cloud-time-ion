/* later could pre-split into words (set) etc, lowercase, etc
 can memoize/canonical-ize after normalizing (lowercase, trim)
* */
import {Filter} from './Filter';

export type SearchableText = string

// /** Can use
//  * https://lodash.com/docs/4.17.15#words
//  * https://lodash.com/docs/4.17.15#deburr
//  * */
// export class SearchableText2 {
//
//   static fromString(searchIn: string) {
//
//   }
// }

/** could pre-process (split, trim) words, include synonyms, etc */

export class SearchableText3 extends Filter {

}
