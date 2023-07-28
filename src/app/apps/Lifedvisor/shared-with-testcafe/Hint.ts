import {HintSource} from './HintSource';
import {max, maxBy, sumBy} from 'lodash-es';
// import {LiHintImpl} from './HintImpl';
import {isNullish} from '../utils/utils';
import {Filter} from './text_search/Filter';
import {SearchScore} from './text_search/SearchScore';
import {textMatchScore} from './text_search/textMatchScore';
import {errorAlert} from '../utils/log';


export class LiHintInclusion {
  /* TODO: examples in the inclusion context; e.g. prioritizing things-hardest-to-change in the context of software design
   * general principle is the same, and the user might have already learned the principle, but the contextual examples might clarify and make the connections stronger
   *
   * Also this could could allow annotating contextually deeper hints in the sub-tree;
   *
   * Users will be able to add their own thoughts and examples OrYoL-style.
   *
   * And journal / progress-tracking for each hint!
   */
}

export class LiHintCommon {

}

export class LiHintDeclaration {

}

export class LiHint {
  isAtRoot ? : boolean = false

  constructor(
    public id?: string,
    public ifYes?: LiHintImpl[],
    public byLang?: { es?: string, pl?: string },
    public title?: string /* will be non-optional when I finish removing `text` */,
    public titleSuffix?: string,
    /** TODO: split into title and contents;
      * bodyText? */
    public text?: string,
    public subTitle?: string,
    /** by default, not searchable; but could search this optionally */
    public textBody?: string,
    public exceptions?: string[],
    public warnings?: string[],
    public source?: string,
    public sources?: HintSource [],
    public when?: string,
    public example?: string /* | LiHintInclusion []*/,
    public examples?: string[] /* | LiHintInclusion []*/,
    public comments?: string,
    public problemText?: string,
    public benefits?: string[],
    /** like Tags in YouTube? - groupings of potential search phrases, as opposed to just keyWORDS? To help improve scoring in algorithm
     * TODO: consider removing prepositions (for on of) and articles (an the)
     */
    public searchTerms?: string[],
    public embedMedia?: {
      videos?: {
        url: string
      }[],
      graphicComponents?: string[],
      amazonProducts?: string[],
    }
  ) {
  }

}

export function hint(param?: LiHint | string): LiHintImpl {
  if ( typeof param === 'string' ) {
    return new LiHintImpl(param)
  } else {
    // TODO: move this check into LiHint self-check method
    if ( param ?. ifYes ?. some(ifYesEl => ! ifYesEl) ) {
      window.alert(Error('bad ifYesEl for ' + JSON.stringify(param)))
    }
  }
  return Object.assign(new LiHintImpl(), (param || {}))
}

/** a marker for hint giving context to redirect to other hint */
export const hintBridge = hint
export const problem = hint
export const wish = hint
export const question = hint
// TODO value / quality



export class LiHintImpl extends LiHint {

  ifYesSortedByScoreFiltered: LiHintImpl[] = this.ifYes ?? [] // []

  searchScore ? : SearchScore
  appliedFilter ? : Filter

  // /** sorting should happen *after* we process descendants */
  // get ifYesSortedByScoreFiltered(): LiHintImpl[] {
  //   // return (this.ifYes ?? []).sort(hint => hint.get)
  // }


  memoized_searchScore = new Map<Filter, SearchScore>();

  /* could be smth like descendant max score in numeric score approach; then could sort; and >0 is isVisibleViaFilter */
  memoized_isVisibleViaFilter = new Map<Filter, boolean>();

  get effectiveTitle(): string {
    return this.title || this.text || this.id || '(NO TITLE!)'
  }

  getScoreForFilter(filter?: Filter): SearchScore {
    if ( ! filter ) {
      return SearchScore.ZERO;
    }
    // if ( this.appliedFilter === filter ) {
    //   return this.searchScore !
    // }
    // if ( this.appliedFilter ) {
    //   errorAlert(`not supported getting score for another filter`, this.appliedFilter, filter)
    // }
    // console.log(`getScoreForFilter filter: `, filter)
    let memoized = this.memoized_searchScore.get(filter);
    if (isNullish(memoized)) {
      // https://www.wordsapi.com/
      // https://github.com/FinNLP/synonyms
      // https://fusejs.io/demo.html -- fuzzy search with misspellings and accents!
      memoized = new SearchScore(
        max([
          10 * textMatchScore(this.effectiveTitle, filter),
          // 10 * textMatchScore(this.title, filter) +
          5 * textMatchScore(this.titleSuffix, filter),
          // textMatchScore(this.text, filter) +
          textMatchScore(this.subTitle, filter), // +
          // textMatchScore(this.comments, filter) +
          // textMatchScore(this.byLang?.es, filter) +
          // textMatchScore(this.byLang?.pl, filter) +
          // textMatchScore(this.id, filter) +
          5 * (max((this.searchTerms ?? []).map(curSearchTerm => textMatchScore(curSearchTerm, filter))) ?? 0)
        ]) ?? 0
      );
      this.memoized_searchScore.set(filter, memoized);
    }
    return memoized;
  }


  matchesFilter(filter: Filter): boolean {
    return this.getScoreForFilter(filter).score > 0
  }

  isVisibleViaFilter(filter: Filter): boolean {
    let memoized = this.memoized_isVisibleViaFilter.get(filter);
    if (!memoized) {
      memoized = (this.getScoreForFilter(filter).score > 0)
        || !!(this.ifYes?.some(childWish => childWish.isVisibleViaFilter(filter)));
      this.memoized_isVisibleViaFilter.set(filter, memoized);
    }
    return memoized;
  }

}
