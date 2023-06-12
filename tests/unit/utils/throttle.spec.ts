import throttle from '@/utils/throttle'
import { advanceBy, clear } from 'jest-date-mock'

describe('@/utils/throttle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
    clear()
  })
  afterAll(() => {
    jest.useRealTimers()
  })
  it('首次调用立即执行', () => {
    const fn = jest.fn()
    const throttledFunc = throttle(fn, 1000)
    throttledFunc()
    expect(fn).toBeCalled()
  })
  it('等待时间内多次调用，仅在距上次调用等待时间后调用第二次', () => {
    const fn = jest.fn()
    const throttledFunc = throttle(fn, 1000)
    throttledFunc(1)
    expect(fn).toBeCalledTimes(1)
    expect(fn).lastCalledWith(1)
    setTimeout(() => {
      advanceBy(500)
      throttledFunc(2)
    }, 500)
    jest.advanceTimersByTime(500)
    expect(fn).toBeCalledTimes(1)
    jest.advanceTimersByTime(500)
    expect(fn).toBeCalledTimes(2)
    expect(fn).toBeCalledWith(2)
  })
})
