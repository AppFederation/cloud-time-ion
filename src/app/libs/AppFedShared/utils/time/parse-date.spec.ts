import {parseDate} from './parse-date'

function t(input: string, year: number, month: number, day: number) {
  it(`Handles input --- ${input} --- with output ${year} ${month} ${day}`, () => {
    const parsed = parseDate(input)
    console.log(`parsed date`, parsed, parsed.getFullYear())
    expect(parsed.getFullYear()).toEqual(year, 'wrong year')
    expect(parsed.getMonth() + 1).toEqual(month, 'wrong month')
    expect(parsed.getDate()).toEqual(day, `wrong day`)
  })
}

describe('parseDate', () => {
  // t('  2020-11-10 some fail', 2020, 3, 10)
  t('  2020-11-10 some comment', 2020, 11, 10)
})
