import * as tpl from '../../src/core/render/tpl'
import fetch from 'node-fetch'
import { AbstractHistory } from '../../src/core/router/history/abstract'
import { Compiler } from '../../src/core/render/compiler'
import { isAbsolutePath } from '../../src/core/router/util'
import { readFileSync } from 'fs'
import { resolve, basename } from 'path'
import resolvePathname from 'resolve-pathname'
import debug from 'debug'

function cwd (...args) {
  return resolve(process.cwd(), ...args)
}

function mainTpl (config) {
  let html = `<nav class="app-nav${config.repo
    ? ''
    : ' no-badge'}"><!--navbar--></nav>`

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
  constructor ({ template, config, cache }) {
    this.html = template
    this.config = config = Object.assign({}, config, {
      routerMode: 'history'
    })
    this.cache = cache

    this.router = new AbstractHistory(config)
    this.compiler = new Compiler(config, this.router)

    this.router.getCurrentPath = () => this.url
    this._renderHtml(
      'inject-config',
      `<script>window.$docsify = ${JSON.stringify(config)}</script>`
    )
    this._renderHtml('inject-app', mainTpl(config))

    this.template = this.html
  }

  _getPath (url) {
    const file = this.router.getFile(url)

    return isAbsolutePath(file) ? file : cwd(`./${file}`)
  }

  async renderToString (url) {
    this.url = url = this.router.parse(url).path
    const { loadSidebar, loadNavbar } = this.config

    const mainFile = this._getPath(url)
    this._renderHtml('main', await this._render(mainFile))

    if (loadSidebar) {
      const name = loadSidebar === true ? '_sidebar.md' : loadSidebar
      const sidebarFile = this._getPath(resolve(url, `./${name}`))
      this._renderHtml('sidebar', await this._render(sidebarFile, 'sidebar'))
    }

    if (loadNavbar) {
      const name = loadNavbar === true ? '_navbar.md' : loadNavbar
      const navbarFile = this._getPath(resolve(url, `./${name}`))
      this._renderHtml('navbar', await this._render(navbarFile, 'navbar'))
    }

    const html = this.html
    this.html = this.template

    return html
  }

  _renderHtml (match, content) {
    this.html = this.html.replace(new RegExp(`<!--${match}-->`, 'g'), content)

    return this.html
  }

  async _render (path, type) {
    let html = await this._loadFile(path)
    const { subMaxLevel, maxLevel } = this.config

    switch (type) {
      case 'sidebar':
        html =
          this.compiler.sidebar(html, maxLevel) +
          `<script>window.__SUB_SIDEBAR__ = ${JSON.stringify(
            this.compiler.subSidebar(subMaxLevel)
          )}</script>`
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

  async _loadFile (filePath) {
    debug('docsify')(`load > ${filePath}`)
    let content
    try {
      if (isAbsolutePath(filePath)) {
        const res = await fetch(filePath)
        if (!res.ok) throw Error()
        content = await res.text()
        this.lock = 0
      } else {
        content = await readFileSync(filePath, 'utf8')
        this.lock = 0
      }
      return content
    } catch (e) {
      this.lock = this.lock || 0
      if (++this.lock > 10) {
        this.lock = 0
        return
      }

      const fileName = basename(filePath)

      return await this._loadFile(resolvePathname(`../${fileName}`, filePath))
    }
  }
}

Renderer.version = '__VERSION__'
