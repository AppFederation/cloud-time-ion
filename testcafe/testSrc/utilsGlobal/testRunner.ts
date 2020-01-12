export const numRepetitions = 20

export let runNum = null

export let testNumWithinRepetition = 0

export function resetRunNum() {
  runNum = null
}

/** Wraps test to enable it being repeated, and measure & log execution time */
export function testWrapper(title: string, testBody: (t) => Promise<void>) {
  const testNumWithinRepetitionCaptured = testNumWithinRepetition
  const repetitionPrefix = (runNum === null || runNum === undefined) ? `(Not repeated)` : `---- (Repetition ${runNum} of ${numRepetitions})`
  test(title, async t => {
    if ( testNumWithinRepetitionCaptured == 0 ) {
      console.log()
      console.log(`==================== Start ${repetitionPrefix}`)
      console.log()
    }
    const startMs = Date.now()
    console.log(`${repetitionPrefix} -- ${title}`)
    await testBody(t)
    const durSecs = ((Date.now() - startMs) / 1000).toFixed(1)
    console.log(`Took ${durSecs} seconds`)
  })
  testNumWithinRepetition ++
}

export function testRepetitions(testsDeclarationFunc: () => void) {
  for ( runNum = 1; runNum <= numRepetitions; ++runNum ) {
    testNumWithinRepetition = 0
    console.log(`Init TestCafe tests repetition ${runNum} of ${numRepetitions}`);
    testsDeclarationFunc()
  }
  resetRunNum()
}

