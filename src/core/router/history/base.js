import { getPath, isAbsolutePath } from '../util'
import { noop } from '../../util/core'

const cached = {}

function getAlias (path, alias, last) {
  const match = Object.keys(alias).filter(key => {
    const re = cached[key] || (cached[key] = new RegExp(`^${key}$`))
    return re.test(path) && path !== last
  })[0]

  return match
    ? getAlias(path.replace(cached[match], alias[match]), alias, path)
    : path
}

function getFileName (path) {
  return /\.(md|html)$/g.test(path)
    ? path
    : /\/$/g.test(path) ? `${path}README.md` : `${path}.md`
}

export class History {
  constructor (config) {
    this.config = config
  }

  getBasePath () {
    return this.config.basePath
  }

  getFile (path, isRelative) {
    path = path || this.getCurrentPath()

    const { config } = this
    const base = this.getBasePath()

    path = config.alias ? getAlias(path, config.alias) : path
    path = getFileName(path)
    path = path === '/README.md' ? config.homepage || path : path
    path = isAbsolutePath(path) ? path : getPath(base, path)

    if (isRelative) {
      path = path.replace(new RegExp(`^${base}`), '')
    }

    return path
  }

  onchange (cb = noop) {
    cb()
  }

  getCurrentPath () {}

  normalize () {}

  parse () {}

  toURL () {}
}
