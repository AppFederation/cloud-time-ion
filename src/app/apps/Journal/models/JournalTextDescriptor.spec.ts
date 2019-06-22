import {JournalTextDescriptors} from './JournalTextDescriptors'

describe('JournalTextDescriptors', () => {
  it('creates from dict, with lateInit', () => {
    const defs = JournalTextDescriptors.instance
    expect(defs.array.length).toBe(10)
    expect(defs.should_continue_doing.uiName).toBe('should continue doing')
  })
})
