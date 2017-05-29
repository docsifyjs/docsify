import { Compiler } from '../../src/core/render/compiler'
import { AbstractHistory } from '../../src/core/router/history/abstract'
import path from 'path'
import fs from 'fs'

export default class Renderer {
  constructor ({
    template,
    path,
    config,
    cache
  }) {
    this.template = template
    this.path = path
    this.config = config
    this.cache = cache

    this.router = new AbstractHistory()
    this.compiler = new Compiler(config, this.router)
  }

  renderToString(url) {
    console.log(url)
  }
}
