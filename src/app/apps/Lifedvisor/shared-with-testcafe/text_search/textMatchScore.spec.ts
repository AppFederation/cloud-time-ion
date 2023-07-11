import {textMatchScore} from './textMatchScore';
import {Filter} from './Filter';

function score(string1: string, string2: string): number {
  return textMatchScore(string1, Filter.fromString(string2))
}

describe(`textMatchScore`, () => {
  it(`matches same word as a perfect 1`, () => {
    expect(score('aWord', 'aword')).toEqual(1)
  })

  it(`matches similar word`, () => {
    const score1 = score('aword', 'awordz');
    expect(score1).toBeGreaterThan(0.5)
    expect(score1).toBeLessThan(1)
  })

  // it(`matches similar word`, () => {
  //   const score1 = score('aWord', 'awordZ');
  //   expect(score1).toBeGreaterThan(0.5)
  //   expect(score1).toBeLessThan(1)
  // })

  it(`scores more similar higher than less similar`, () => {
    expect(
      score(`hello world`, 'hello worlds')
    ).toBeGreaterThan(
      score(`hello world`, 'hello earth')
    )
  })

  it(`rates 2 similar words as better than 1`, () => {
    expect(
      score('john', 'john')).toBeLessThan(
      score('john smith', 'john smith')
    )
  })

})
