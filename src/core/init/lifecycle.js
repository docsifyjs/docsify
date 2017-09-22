import { noop } from '../util/core'

export function initLifecycle (vm) {
  const hooks = [
    'init',
    'mounted',
    'beforeEach',
    'afterEach',
    'doneEach',
    'ready'
  ]

  vm._hooks = {}
  vm._lifecycle = {}
  hooks.forEach(hook => {
    const arr = (vm._hooks[hook] = [])
    vm._lifecycle[hook] = fn => arr.push(fn)
  })
}

export function callHook (vm, hook, data, next = noop) {
  const queue = vm._hooks[hook]

  const step = function (index) {
    const hook = queue[index]
    if (index >= queue.length) {
      next(data)
    } else {
      if (typeof hook === 'function') {
        if (hook.length === 2) {
          hook(data, result => {
            data = result
            step(index + 1)
          })
        } else {
          const result = hook(data)
          data = result !== undefined ? result : data
          step(index + 1)
        }
      } else {
        step(index + 1)
      }
    }
  }

  step(0)
}
