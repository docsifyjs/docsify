import marked from 'marked'
import Prism from 'prismjs'
import {helper as helperTpl, tree as treeTpl} from './tpl'
import {genTree} from './gen-tree'
import {slugify} from './slugify'
import {emojify} from './emojify'
import {isAbsolutePath, getPath, getParentPath} from '../router/util'
import {isFn, merge, cached, isPrimitive} from '../util/core'

const cachedLinks = {}

export function getAndRemoveConfig(str = '') {
  const config = {}

  if (str) {
    str = str
      .replace(/^'|'$/, '')
      .replace(/:([\w-]+)=?([\w-]+)?/g, (m, key, value) => {
        config[key] = (value && value.replace(/&quot;/g, '')) || true
        return ''
      })
      .trim()
  }

  return {str, config}
}

const compileMedia = {
  markdown(url) {
    return {
      url
    }
  },
  mermaid(url) {
    return {
      url
    }
  },
  iframe(url, title) {
    return {
      html: `<iframe src="${url}" ${title || 'width=100% height=400'}></iframe>`
    }
  },
  video(url, title) {
    return {
      html: `<video src="${url}" ${title || 'controls'}>Not Support</video>`
    }
  },
  audio(url, title) {
    return {
      html: `<audio src="${url}" ${title || 'controls'}>Not Support</audio>`
    }
  },
  code(url, title) {
    let lang = url.match(/\.(\w+)$/)

    lang = title || (lang && lang[1])
    if (lang === 'md') {
      lang = 'markdown'
    }

    return {
      url,
      lang
    }
  }
}

export class Compiler {
  constructor(config, router) {
    this.config = config
    this.router = router
    this.cacheTree = {}
    this.toc = []
    this.cacheTOC = {}
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

    this._marked = compile
    this.compile = text => {
      let isCached = true
      const result = cached(_ => {
        isCached = false
        let html = ''

        if (!text) {
          return text
        }

        if (isPrimitive(text)) {
          html = compile(text)
        } else {
          html = compile.parser(text)
        }

        html = config.noEmoji ? html : emojify(html)
        slugify.clear()

        return html
      })(text)

      const curFileName = this.router.parse().file

      if (isCached) {
        this.toc = this.cacheTOC[curFileName]
      } else {
        this.cacheTOC[curFileName] = [...this.toc]
      }

      return result
    }
  }

  compileEmbed(href, title) {
    const {str, config} = getAndRemoveConfig(title)
    let embed
    title = str

    if (config.include) {
      if (!isAbsolutePath(href)) {
        href = getPath(
          process.env.SSR ? '' : this.contentBase,
          getParentPath(this.router.getCurrentPath()),
          href
        )
      }

      let media
      if (config.type && (media = compileMedia[config.type])) {
        embed = media.call(this, href, title)
        embed.type = config.type
      } else {
        let type = 'code'
        if (/\.(md|markdown)/.test(href)) {
          type = 'markdown'
        } else if (/\.mmd/.test(href)) {
          type = 'mermaid'
        } else if (/\.html?/.test(href)) {
          type = 'iframe'
        } else if (/\.(mp4|ogg)/.test(href)) {
          type = 'video'
        } else if (/\.mp3/.test(href)) {
          type = 'audio'
        }
        embed = compileMedia[type].call(this, href, title)
        embed.type = type
      }

      return embed
    }
  }

  _matchNotCompileLink(link) {
    const links = this.config.noCompileLinks || []

    for (var i = 0; i < links.length; i++) {
      const n = links[i]
      const re = cachedLinks[n] || (cachedLinks[n] = new RegExp(`^${n}$`))

      if (re.test(link)) {
        return link
      }
    }
  }

  _initRenderer() {
    const renderer = new marked.Renderer()
    const {linkTarget, router, contentBase} = this
    const _self = this
    const origin = {}

    /**
     * Render anchor tag
     * @link https://github.com/markedjs/marked#overriding-renderer-methods
     */
    origin.heading = renderer.heading = function (text, level) {
      const nextToc = {level, title: text}

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
      const url = router.toURL(router.getCurrentPath(), {id: slug})
      nextToc.slug = url
      _self.toc.push(nextToc)

      return `<h${level} id="${slug}"><a href="${url}" data-id="${slug}" class="anchor"><span>${text}</span></a></h${level}>`
    }
    // Highlight code
    origin.code = renderer.code = function (code, lang = '') {
      code = code.replace(/@DOCSIFY_QM@/g, '`')
      const hl = Prism.highlight(
        code,
        Prism.languages[lang] || Prism.languages.markup
      )

      return `<pre v-pre data-lang="${lang}"><code class="lang-${lang}">${hl}</code></pre>`
    }
    origin.link = renderer.link = function (href, title = '', text) {
      let attrs = ''

      const {str, config} = getAndRemoveConfig(title)
      title = str

      if (
        !isAbsolutePath(href) &&
        !_self._matchNotCompileLink(href) &&
        !config.ignore
      ) {
        if (href === _self.config.homepage) {
          href = 'README'
        }
        href = router.toURL(href, null, router.getCurrentPath())
      } else {
        attrs += href.startsWith('mailto:') ? '' : ` target="${linkTarget}"`
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
      let result
      if (/^!&gt;/.test(text)) {
        result = helperTpl('tip', text)
      } else if (/^\?&gt;/.test(text)) {
        result = helperTpl('warn', text)
      } else {
        result = `<p>${text}</p>`
      }
      return result
    }
    origin.image = renderer.image = function (href, title, text) {
      let url = href
      let attrs = ''

      const {str, config} = getAndRemoveConfig(title)
      title = str

      if (config['no-zoom']) {
        attrs += ' data-no-zoom'
      }

      if (title) {
        attrs += ` title="${title}"`
      }

      const size = config.size
      if (size) {
        const sizes = size.split('x')
        if (sizes[1]) {
          attrs += 'width=' + sizes[0] + ' height=' + sizes[1]
        } else {
          attrs += 'width=' + sizes[0]
        }
      }

      if (!isAbsolutePath(href)) {
        url = getPath(contentBase, getParentPath(router.getCurrentPath()), href)
      }

      return `<img src="${url}"data-origin="${href}" alt="${text}"${attrs}>`
    }

    renderer.origin = origin

    return renderer
  }

  /**
   * Compile sidebar
   */
  sidebar(text, level) {
    const currentPath = this.router.getCurrentPath()
    let html = ''

    if (text) {
      html = this.compile(text)
    } else {
      const tree = this.cacheTree[currentPath] || genTree(this.toc, level)
      html = treeTpl(tree, '<ul>{inner}</ul>')
      this.cacheTree[currentPath] = tree
    }

    return html
  }

  /**
   * Compile sub sidebar
   */
  subSidebar(level) {
    if (!level) {
      this.toc = []
      return
    }
    const currentPath = this.router.getCurrentPath()
    const {cacheTree, toc} = this

    toc[0] && toc[0].ignoreAllSubs && toc.splice(0)
    toc[0] && toc[0].level === 1 && toc.shift()

    for (let i = 0; i < toc.length; i++) {
      toc[i].ignoreSubHeading && toc.splice(i, 1) && i--
    }

    const tree = cacheTree[currentPath] || genTree(toc, level)

    cacheTree[currentPath] = tree
    this.toc = []
    return treeTpl(tree)
  }

  article(text) {
    return this.compile(text)
  }

  /**
   * Compile cover page
   */
  cover(text) {
    const cacheToc = this.toc.slice()
    const html = this.compile(text)

    this.toc = cacheToc.slice()

    return html
  }
}
