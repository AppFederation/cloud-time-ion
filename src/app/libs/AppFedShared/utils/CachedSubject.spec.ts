import { CachedSubjectBugged } from './CachedSubjectBugged'

describe('CachedSubject', () => {
  it('next', () => {
    const cachedSubject = new CachedSubjectBugged()
    cachedSubject.next('someVal')
    expect(cachedSubject.lastVal).toBe('someVal')
  })
})
