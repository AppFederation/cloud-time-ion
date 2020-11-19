import {countByMulti} from './countByMulti'

describe(`countByMulti`, () => {
  function checkCase2Levels(input: any[], expected: any) {
    it(`handles input (2lv) - ` + JSON.stringify(input), () => {
      expect(countByMulti(input, [`a` as any, `status`])).toEqual(expected)
    })
  }

  function checkCase3Levels(input: any[], expected: any) {
    it(`handles input (3lv) - ` + JSON.stringify(input), () => {
      expect(countByMulti(input, [`a` as any, `status`, `field3`])).toEqual(expected)
    })
  }

  checkCase2Levels(
    [{a: 99, status: `done`}],
    {
      99: {
        done: 1
      }
    }
  )
  checkCase2Levels(
    [
      {a: 99, status: `done`},
      {a: 99, status: `done`}
    ],
    {
      99: {
        done: 2
      }
    }
  )
  checkCase2Levels(
    [
      {a: 99, status: `done`},
      {a: 299, status: `done`}
    ],
    {
      99: {
        done: 1
      },
      299: {
        done: 1
      }
    }
  )
  checkCase2Levels(
    [
      {a: 99, status: `done`},
      {a: 99}
    ],
    {
      99: {
        done: 1,
        undefined: 1
      },
    }
  )
  checkCase3Levels(
    [
      {a: 99, status: `done`, field3: `field3Val`},
      {a: 99}
    ],
    // {
    //   99: {
    //     done: {
    //       field3Val: 1
    //     },
    //     undefined: 1
    //   },
    // }
    {
      99: {
        done: {
          field3Val: 1
        },
        undefined: {
          undefined: 1
        }
      },
    }

  )
})
