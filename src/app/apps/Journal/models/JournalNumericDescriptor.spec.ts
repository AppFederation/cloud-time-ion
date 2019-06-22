import {JournalNumericDescriptors} from './JournalNumericDescriptors'

describe('JournalNumericDescriptors', () => {
  it('creates from dict, with lateInit', () => {
    const defs = JournalNumericDescriptors.instance
    expect(defs.array.length).toBe(14)
    console.log(JournalNumericDescriptors)
    expect(defs.long_term_thinking.uiName).toBe('long term thinking')
  })
})
