type Func = (...args: any[]) => any
/**
 * 防抖包装函数，会在等待时间后执行函数，如果在等待时间内多次调用，会取消前面调用，仅最后一次调用会被执行
 * @param {Function} fn 原始函数
 * @param {Number} wait 等待时长，以毫秒为单位
 * @param {Boolean} immediate 首次调用是否立即执行
 */
export default function (fn: Func, wait: number, immediate = false): Func {
  let timer: ReturnType<typeof setTimeout> | null

  return function (this: any, ...args: any[]): any {
    const isExecImmediate = immediate && !timer
    if (isExecImmediate) {
      fn.apply(this, args)
    }
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      if (!isExecImmediate) {
        fn.apply(this, args)
      }
      timer = null
    }, wait)
  }
}
