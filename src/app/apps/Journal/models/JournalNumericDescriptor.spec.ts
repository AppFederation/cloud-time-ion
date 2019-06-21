import {JournalNumericDescriptor, JournalNumericDescriptors} from './JournalNumericDescriptors'

describe('JournalNumericDescriptors', () => {
  it('creates from dict, with lateInit', () => {
    expect(JournalNumericDescriptors.instance.array.length).toBe(12)
    console.log(JournalNumericDescriptors)
    expect(JournalNumericDescriptors.instance.long_term_thinking.uiName).toBe('long term thinking')
  })
})
