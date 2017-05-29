import { Compiler } from '../../src/core/render/compiler'
import { AbstractHistory } from '../../src/core/router/history/abstract'
import { resolve, basename } from 'path'
import { readFileSync } from 'fs'
import * as tpl from '../../src/core/render/tpl'

function cwd (...args) {
  return resolve(process.cwd(), ...args)
}

function mainTpl (config) {
  let html = `<nav class="app-nav${config.repo ? '' : 'no-badge'}"><!--navbar--></nav>`

  if (config.repo) {
    html += tpl.corner(config.repo)
  }
  if (config.coverpage) {
    html += tpl.cover()
  }

  html += tpl.main(config)

  return html
}

export default class Renderer {
  constructor ({
    template,
    path,
    config,
    cache
  }) {
    this.html = this.template = template
    this.path = cwd(path)
    this.config = Object.assign(config, {
      routerMode: 'history'
    })
    this.cache = cache

    this.router = new AbstractHistory(config)
    this.compiler = new Compiler(config, this.router)

    this.router.getCurrentPath = () => this.url
    this._renderHtml('inject-config', `<script>window.$docsify = ${JSON.stringify(config)}</script>`)
    this._renderHtml('inject-app', mainTpl(config))
  }

  renderToString (url) {
    this.url = url
    // TODO render cover page
    const { loadSidebar, loadNavbar } = this.config

    const mainFile = cwd(this.path, `./${this.router.getFile(url)}`)
    this._renderHtml('main', this._render(mainFile))

    if (loadSidebar) {
      const name = loadSidebar === true ? '_sidebar.md' : loadSidebar
      const sidebarFile = cwd(mainFile, '..', name)
      this._renderHtml('sidebar', this._render(sidebarFile, 'sidebar'))
    }

    if (loadNavbar) {
      const name = loadNavbar === true ? '_navbar.md' : loadNavbar
      const navbarFile = cwd(mainFile, '..', name)
      this._renderHtml('navbar', this._render(navbarFile, 'navbar'))
    }

    return this.html
  }

  _renderHtml (match, content) {
    this.html = this.html.replace(new RegExp(`<!--${match}-->`, 'g'), content)
  }

  _render (path, type) {
    let html = this._loadFile(path)

    switch (type) {
      case 'sidebar':
        html = this.compiler.sidebar(html)
        break
      case 'cover':
        html = this.compiler.cover(html)
        break
      case 'navbar':
      case 'article':
      default:
        html = this.compiler.compile(html)
        break
    }

    return html
  }

  _loadFile (filePath) {
    try {
      return readFileSync(filePath, 'utf8')
    } catch (e) {
      const fileName = basename(filePath)
      const parentPath = cwd(filePath, '../..')

      if (this.path.length < parentPath.length) {
        throw Error(`Not found file ${fileName}`)
      }

      this._loadFile(cwd(filePath, '../..', fileName))
    }
  }
}
