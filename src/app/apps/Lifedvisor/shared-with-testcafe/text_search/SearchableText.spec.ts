import {SearchableText3} from './SearchableText';

describe(`SearchableText`, () => {
  it(`splits into words`, () => {
    // const wordsNormalized = SearchableText3.fromString(`wordA11  word2 word3`).wordsNormalized;
    const wordsNormalized = SearchableText3.fromString(`worda  wordb wordzz`).wordsNormalized;
    console.log(wordsNormalized)
    expect(wordsNormalized.length).toBe(3)
  })
})
