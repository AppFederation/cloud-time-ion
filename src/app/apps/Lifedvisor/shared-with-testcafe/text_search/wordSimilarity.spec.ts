import {wordSimilarity} from './wordSimilarity';

function simil(word1: string, word2: string) {
  return wordSimilarity(word1, word2)
}

describe(`wordSimilarity`, () => {
  it(`rates identical words as perfect 1`, () => {
    expect(simil('motivation', 'motivation')).toEqual(1)
  })

  it(`rates completely different words as 0`, () => {
    expect(simil('abc', 'xyz')).toEqual(0)
    expect(simil('giraffe', 'elephant')).toEqual(0)
  })

  it(`rates longer words with same distance as more similar than shorter ones`, () => {
    expect(
      simil('a', 'at')).toBeLessThan(
      simil('study', 'studyi')
    )
  })

  it(`rates transposition more similar than changing 2 letters`, () => {
    expect(
      simil('bulb', 'byyb')).toBeLessThan(
      simil('bulb', 'blub')
    )
  })

  it(`rates 1 insertion as more similar than 2`, () => {
    expect(
      simil('bulb', 'bulbot')).toBeLessThan(
      simil('bulb', 'bulbo')
    )
  })

  it(`rates 1 deletion as more similar than 2`, () => {
    expect(
      simil('motion', 'motn')).toBeLessThan(
      simil('motion', 'motin')
    )
  })

  it(`is case insensitive`, () => {
    expect(simil('abc', 'ABC')).toEqual(1)

    expect(
      simil('motion', 'EMOTION')).toEqual(
      simil('Motion', 'emotion')
    )
  })

})
