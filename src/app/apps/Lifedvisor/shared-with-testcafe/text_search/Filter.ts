// export type Filter = string
import {escapeRegExp} from '../../utils/regexp.utils';
import {isNullishOrWhitespace} from '../../utils/string-utils';
import {words} from 'lodash-es';

export class Filter {

  static NONE: Filter = new Filter([]);

  public wordsEscapedAsRegexpLowerCase: string[];

  public wordsNormalized: string[];

  constructor(
      private wordsRaw: string[],
  ) {
    this.wordsNormalized = this.wordsRaw.map(word => word.trim().toLowerCase());
    this.wordsEscapedAsRegexpLowerCase = this.wordsNormalized.map(escapeRegExp);
  }

  static fromString(string: string) {
    // can try _.words()
    // const splitWords = string.split(/s+/);
    // const splitWords = string.split(/W+/); // \W+ for stuff like slash
    const splitWords = words(string).slice(0, 25)

    return new Filter(splitWords.map(s => s.trim()).filter(split => ! isNullishOrWhitespace(split)));
  }
}
