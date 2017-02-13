export default class Hook {
  constructor () {
    this.beforeHooks = []
    this.afterHooks = []
    this.initHooks = []
    this.readyHooks = []
    this.doneEachHooks = []
  }

  beforeEach (fn) {
    this.beforeHooks.push(fn)
  }

  afterEach (fn) {
    this.afterHooks.push(fn)
  }

  doneEach (fn) {
    this.doneEachHooks.push(fn)
  }

  init (fn) {
    this.initHooks.push(fn)
  }

  ready (fn) {
    this.readyHooks.push(fn)
  }

  emit (name, data, next) {
    let newData = data
    const queue = this[name + 'Hooks']
    const step = function (index) {
      const hook = queue[index]
      if (index >= queue.length) {
        next && next(newData)
      } else {
        if (typeof hook === 'function') {
          if (hook.length === 2) {
            hook(data, result => {
              newData = result
              step(index + 1)
            })
          } else {
            const result = hook(data)
            newData = result !== undefined ? result : newData
            step(index + 1)
          }
        } else {
          step(index + 1)
        }
      }
    }

    step(0)
  }
}
