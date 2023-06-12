type Func = (...args: any[]) => any
/**
 * 节流包装函数
 * @param {Function} fn 原始函数
 * @param {Number} wait 等待时长，以毫秒为单位
 */
export default function throttle (fn: Func, wait: number): Func {
  let timer: ReturnType<typeof setTimeout> | null
  let lastExecTime = 0

  return function (this: any, ...args: any[]) {
    const currentTime = Date.now()
    const remainTime = lastExecTime + wait - currentTime
    if (remainTime <= 0) {
      lastExecTime = currentTime
      return fn.apply(this, args)
    }

    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, remainTime)
  }
}
