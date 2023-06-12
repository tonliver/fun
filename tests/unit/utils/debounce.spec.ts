import debounce from '@/utils/debounce'

describe('utils/debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    jest.clearAllTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  it('在等待时间后调用', () => {
    const fn = jest.fn()
    const debouncedFunc = debounce(fn, 1000, false)
    debouncedFunc()
    expect(fn).not.toBeCalled()
    jest.advanceTimersByTime(1000)
    expect(fn).toBeCalled()
  })
  it('在等待时间内连续调用，会以最后一次调用重置等待时间', () => {
    const fn = jest.fn()
    const debouncedFunc = debounce(fn, 1000, false)
    debouncedFunc()
    setTimeout(() => {
      debouncedFunc()
    }, 500)
    // 1000ms后仍然不会调用
    jest.advanceTimersByTime(1000)
    expect(fn).not.toBeCalled()
    // 500 + 1000ms后首次调用
    jest.advanceTimersByTime(500)
    expect(fn).toBeCalled()
  })
  it('多次调用，间隔时间大于等待时间，每次都能成功执行', () => {
    const fn = jest.fn()
    const debouncedFunc = debounce(fn, 1000, false)
    debouncedFunc(1)
    jest.advanceTimersByTime(1000)
    expect(fn).toBeCalledTimes(1)
    expect(fn).lastCalledWith(1)
    debouncedFunc(2)
    jest.advanceTimersByTime(1000)
    expect(fn).toBeCalledTimes(2)
    expect(fn).lastCalledWith(2)
  })
  it('首次立即执行', () => {
    const fn = jest.fn()
    const debouncedFunc = debounce(fn, 1000, true)
    debouncedFunc()
    expect(fn).toBeCalled()
  })
})
