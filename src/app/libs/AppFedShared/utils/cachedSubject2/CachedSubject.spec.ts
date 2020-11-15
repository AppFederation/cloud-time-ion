import {CachedSubject} from './CachedSubject2';


describe('CachedSubject', () => {

  it('next stores lastVal', () => {
    const cachedSubject = new CachedSubject<string>()

    cachedSubject.next('someVal') // ==== ACT

    expect(cachedSubject.lastVal).toBe('someVal')
  })

  it('subscribe() retrieves value put *after* subscribing', () => {
    const cachedSubject = new CachedSubject<string>()
    let valFromSubscribe: string | null = null
    cachedSubject.subscribe((val) => {
      valFromSubscribe = val
    })

    cachedSubject.next('someVal') // ==== ACT

    expect(cachedSubject.hasEmitted).toBe(true)
    expect(cachedSubject.lastVal).toBe('someVal')

    // main ASSERT:
    expect(valFromSubscribe).toBe('someVal' as any)
  })

  it('subscribe() retrieves value put *before* subscribing (like ReplaySubject)', () => {
    const cachedSubject = new CachedSubject<string>()
    let valFromSubscribe = null

    cachedSubject.next('someVal') // ARRANGE
    expect(cachedSubject.hasEmitted).toBe(true) // sanity check

    // ==== ACT :
    cachedSubject.subscribe((val) => {
      valFromSubscribe = val as any
    })

    expect(cachedSubject.lastVal).toBe('someVal')

    // main ASSERT:
    expect(valFromSubscribe).toBe('someVal' as any)
  })

})
