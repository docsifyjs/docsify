import { getPath, isAbsolutePath } from '../util'
import { noop } from '../../util/core'

function getAlias (path, alias) {
  return alias[path] ? getAlias(alias[path], alias) : path
}

function getFileName (path) {
  return /\.(md|html)$/g.test(path)
    ? path
    : /\/$/g.test(path)
      ? `${path}README.md`
      : `${path}.md`
}

export class History {
  constructor (config) {
    this.config = config
  }

  getBasePath () {
    return this.config.basePath
  }

  getFile (path) {
    path = path || this.getCurrentPath()

    const { config } = this
    const base = this.getBasePath()

    path = config.alias ? getAlias(path, config.alias) : path
    path = getFileName(path)
    path = path === '/README.md' ? (config.homepage || path) : path
    path = isAbsolutePath(path) ? path : getPath(base, path)

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
