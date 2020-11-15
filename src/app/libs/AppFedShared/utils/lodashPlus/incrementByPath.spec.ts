import {incrementByPath} from './incrementByPath'

describe(`incrementByPath`, () => {
  it (`increments single level`, () => {
    expect(incrementByPath({}, [`a`])).toEqual({
      a: 1
    })
  })
  it (`increments on empty object`, () => {
    expect(incrementByPath({}, [`a`, `b`])).toEqual({
      a: {
        b: 1
      }
    })
  })

  it (`increments on semi-empty object`, () => {
    expect(incrementByPath({a: {}}, [`a`, `b`])).toEqual({
      a: {
        b: 1
      }
    })
  })

  it (`increments on existing number`, () => {
    expect(incrementByPath({a: {b: 5}, c: 9}, [`a`, `b`])).toEqual({
      a: {
        b: 6
      },
      c: 9
    })
  })

})
