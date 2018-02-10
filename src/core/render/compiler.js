import marked from 'marked'
import Prism from 'prismjs'
import { helper as helperTpl, tree as treeTpl } from './tpl'
import { genTree } from './gen-tree'
import { slugify } from './slugify'
import { emojify } from './emojify'
import { isAbsolutePath, getPath } from '../router/util'
import { isFn, merge, cached } from '../util/core'
import { get } from '../fetch/ajax'

const cachedLinks = {}
function getAndRemoveConfig (str = '') {
  const config = {}

  if (str) {
    str = str
      .replace(/:([\w-]+)=?([\w-]+)?/g, (m, key, value) => {
        config[key] = value || true
        return ''
      })
      .trim()
  }

  return { str, config }
}
const compileMedia = {
  markdown (url, config) {
    const request = get(url, false)
    const id = `docsify-get-${request.uid}`

    request.then(text => {
      document.getElementById(id).innerHTML = this.compile(text)
    })

    return `<div data-origin="${url}" id=${id}></div>`
  },
  html (url, config) {
    return `<iframe src="${url}" ${config || 'width=100% height=400'}></iframe>`
  },
  video (url, config) {
    return `<video src="${url}" ${config || 'controls'}>Not Support</video>`
  },
  audio (url, config) {
    return `<audio src="${url}" ${config || 'controls'}>Not Support</audio>`
  }
}

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
      marked.setOptions(
        merge(mdConf, {
          renderer: merge(renderer, mdConf.renderer)
        })
      )
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
    const links = this.config.noCompileLinks || []

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
      const hl = Prism.highlight(
        code,
        Prism.languages[lang] || Prism.languages.markup
      )

      return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
    }
    origin.link = renderer.link = function (href, title = '', text) {
      let attrs = ''

      const { str, config } = getAndRemoveConfig(title)
      title = str

      if (
        !/:|(\/{2})/.test(href) &&
        !_self.matchNotCompileLink(href) &&
        !config.ignore
      ) {
        href = router.toURL(href, null, router.getCurrentPath())
      } else {
        attrs += ` target="${linkTarget}"`
      }

      if (config.target) {
        attrs += ' target=' + config.target
      }

      if (config.disabled) {
        attrs += ' disabled'
        href = 'javascript:void(0)'
      }

      if (title) {
        attrs += ` title="${title}"`
      }

      return `<a href="${href}"${attrs}>${text}</a>`
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
      let attrs = ''

      const { str, config } = getAndRemoveConfig(title)
      title = str

      if (config['no-zoom']) {
        attrs += ' data-no-zoom'
      }

      if (title) {
        attrs += ` title="${title}"`
      }

      if (!isAbsolutePath(href)) {
        url = getPath(contentBase, href)
      }

      let media
      if (config.type && (media = compileMedia[config.type])) {
        return media.call(_self, url, title)
      }

      let type = null
      if (/\.(md|markdown)/.test(url)) {
        type = 'markdown'
      } else if (/\.html?/.test(url)) {
        type = 'html'
      } else if (/\.(mp4|ogg)/.test(url)) {
        type = 'video'
      } else if (/\.mp3/.test(url)) {
        type = 'audio'
      }
      if (type) {
        return compileMedia[type].call(_self, url, title)
      }

      return `<img src="${url}"data-origin="${href}" alt="${text}"${attrs}>`
    }

    const CHECKED_RE = /^\[([ x])\] +/
    origin.listitem = renderer.listitem = function (text) {
      const checked = CHECKED_RE.exec(text)
      if (checked) {
        text = text.replace(
          CHECKED_RE,
          `<input type="checkbox" ${checked[1] === 'x' ? 'checked' : ''} />`
        )
      }
      return `<li${checked ? ` class="task-list-item"` : ''}>${text}</li>\n`
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

    toc[0] && toc[0].ignoreAllSubs && toc.splice(0)
    toc[0] && toc[0].level === 1 && toc.shift()

    for (let i = 0; i < toc.length; i++) {
      toc[i].ignoreSubHeading && toc.splice(i, 1) && i--
    }

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
