import initComponet from './component'
import { init as initSearch } from './search'

const CONFIG = {
  placeholder: 'Type to search',
  paths: 'auto',
  maxAge: 86400000 // 1 day
}

const install = function (hook, vm) {
  const util = Docsify.util
  const opts = vm.config.search

  if (Array.isArray(opts)) {
    CONFIG.paths = opts
  } else if (typeof opts === 'object') {
    CONFIG.paths = Array.isArray(opts.paths) ? opts.paths : 'auto'
    CONFIG.maxAge = util.isPrimitive(opts.maxAge) ? opts.maxAge : CONFIG.maxAge
    CONFIG.placeholder = opts.placeholder || CONFIG.placeholder
  }

  const isAuto = CONFIG.paths === 'auto'

  hook.ready(_ => {
    initComponet(CONFIG)
    isAuto && initSearch(CONFIG, vm)
  })
  !isAuto && hook.doneEach(_ => initSearch(CONFIG, vm))
}

window.$docsify.plugins = [].concat(install, window.$docsify.plugins)
