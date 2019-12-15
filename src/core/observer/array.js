/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 拿到结果
    const result = original.apply(this, args)
    // 当前observer
    const ob = this.__ob__
    let inserted
    switch (method) {
      // push 和 unshift会新增索引
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新增索引，才会重新处理响应数据
    if (inserted) ob.observeArray(inserted)
    // 通知变化
    ob.dep.notify()
    return result
  })
})
