import {getByPath} from './getByPath'

describe(`getByPath`, () => {
  it (`gets single level on empty`, () => {
    expect(getByPath({}, [`a`])).toEqual(undefined)
  })
  it (`gets single level when present`, () => {
    expect(getByPath({a: `val`}, [`a`])).toEqual(`val`)
  })

  it (`gets multi-level on empty object`, () => {
    expect(getByPath({}, [`a`, `b`])).toEqual(undefined)
  })

  it (`gets on semi-empty object`, () => {
    expect(getByPath({a: {}}, [`a`, `b`])).toEqual(undefined)
  })

  it (`gets from object with full 2-level path`, () => {
    expect(getByPath({a: {b: 5}, c: 9}, [`a`, `b`])).toEqual(5)
  })
  it (`gets from object with 3-level full path`, () => {
    expect(getByPath({a: {b: {c: 'ValC'}}, c: 9}, [`a`, `b`, `c`])).toEqual('ValC')
  })

  it (`gets from object with null`, () => {
    expect(getByPath({a: null, c: 9}, [`a`, `b`])).toEqual(null /* maybe undefined ; should probably match ?. operator */)
  })

})
