import marked from 'marked'
import Prism from 'prismjs'
import { helper as helperTpl, tree as treeTpl } from './tpl'
import { genTree } from './gen-tree'
import { slugify } from './slugify'
import { emojify } from './emojify'
import { isAbsolutePath, getPath } from '../router/util'
import { isFn, merge, cached } from '../util/core'

const cachedLinks = {}

export class Compiler {
  constructor (config, router) {
    this.config = config
    this.router = router
    this.cacheTree = {}
    this.toc = []
    this.linkTarget = config.externalLinkTarget || '_blank'
    this.contentBase = router.getBasePath()

    const renderer = this._initRenderer()
    let compile
    const mdConf = config.markdown || {}

    if (isFn(mdConf)) {
      compile = mdConf(marked, renderer)
    } else {
      marked.setOptions(merge(mdConf, {
        renderer: merge(renderer, mdConf.renderer)
      }))
      compile = marked
    }

    this.compile = cached(text => {
      let html = ''

      if (!text) return text

      html = compile(text)
      html = config.noEmoji ? html : emojify(html)
      slugify.clear()

      return html
    })
  }

  matchNotCompileLink (link) {
    const links = this.config.noCompileLinks

    for (var i = 0; i < links.length; i++) {
      const n = links[i]
      const re = cachedLinks[n] || (cachedLinks[n] = new RegExp(`^${n}$`))

      if (re.test(link)) {
        return link
      }
    }
  }

  _initRenderer () {
    const renderer = new marked.Renderer()
    const { linkTarget, router, contentBase } = this
    const _self = this
    const origin = {}

    /**
     * render anchor tag
     * @link https://github.com/chjj/marked#overriding-renderer-methods
     */
    origin.heading = renderer.heading = function (text, level) {
      const nextToc = { level, title: text }

      if (/{docsify-ignore}/g.test(text)) {
        text = text.replace('{docsify-ignore}', '')
        nextToc.title = text
        nextToc.ignoreSubHeading = true
      }

      if (/{docsify-ignore-all}/g.test(text)) {
        text = text.replace('{docsify-ignore-all}', '')
        nextToc.title = text
        nextToc.ignoreAllSubs = true
      }

      const slug = slugify(text)
      const url = router.toURL(router.getCurrentPath(), { id: slug })
      nextToc.slug = url
      _self.toc.push(nextToc)

      return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
    }
    // highlight code
    origin.code = renderer.code = function (code, lang = '') {
      const hl = Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup)

      return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
    }
    origin.link = renderer.link = function (href, title, text) {
      let blank = ''

      if (!/:|(\/{2})/.test(href) &&
        !_self.matchNotCompileLink(href) &&
        !/(\s?:ignore)(\s\S+)?$/.test(title)) {
        href = router.toURL(href, null, router.getCurrentPath())
      } else {
        blank = ` target="${linkTarget}"`
        title = title && title.replace(/:ignore/g, '').trim()
      }

      let target = title && title.match(/:target=\w+/)
      if (target) {
        target = target[0]
        title = title.replace(target, '')
        blank = ' ' + target.slice(1)
      }

      if (title) {
        title = ` title="${title}"`
      }
      return `<a href="${href}"${title || ''}${blank}>${text}</a>`
    }
    origin.paragraph = renderer.paragraph = function (text) {
      if (/^!&gt;/.test(text)) {
        return helperTpl('tip', text)
      } else if (/^\?&gt;/.test(text)) {
        return helperTpl('warn', text)
      }
      return `<p>${text}</p>`
    }
    origin.image = renderer.image = function (href, title, text) {
      let url = href
      const titleHTML = title ? ` title="${title}"` : ''

      if (!isAbsolutePath(href)) {
        url = getPath(contentBase, href)
      }

      return `<img src="${url}" data-origin="${href}" alt="${text}"${titleHTML}>`
    }

    renderer.origin = origin

    return renderer
  }

  /**
   * Compile sidebar
   */
  sidebar (text, level) {
    const currentPath = this.router.getCurrentPath()
    let html = ''

    if (text) {
      html = this.compile(text)
      html = html && html.match(/<ul[^>]*>([\s\S]+)<\/ul>/g)[0]
    } else {
      const tree = this.cacheTree[currentPath] || genTree(this.toc, level)
      html = treeTpl(tree, '<ul>')
      this.cacheTree[currentPath] = tree
    }

    return html
  }

  /**
   * Compile sub sidebar
   */
  subSidebar (level) {
    if (!level) {
      this.toc = []
      return
    }
    const currentPath = this.router.getCurrentPath()
    const { cacheTree, toc } = this

    toc[0] && toc[0].ignoreAllSubs && (this.toc = [])
    toc[0] && toc[0].level === 1 && toc.shift()
    toc.forEach((node, i) => {
      node.ignoreSubHeading && toc.splice(i, 1)
    })

    const tree = cacheTree[currentPath] || genTree(toc, level)

    cacheTree[currentPath] = tree
    this.toc = []
    return treeTpl(tree, '<ul class="app-sub-sidebar">')
  }

  article (text) {
    return this.compile(text)
  }

  /**
   * Compile cover page
   */
  cover (text) {
    const cacheToc = this.toc.slice()
    const html = this.compile(text)

    this.toc = cacheToc.slice()

    return html
  }
}
