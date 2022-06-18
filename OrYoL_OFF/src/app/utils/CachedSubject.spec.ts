import { CachedSubject } from './CachedSubject'

describe('CachedSubject', () => {
  it('next', () => {
    const cachedSubject = new CachedSubject()
    cachedSubject.next('someVal')
    expect(cachedSubject.lastVal).toBe('someVal')
  })
})
