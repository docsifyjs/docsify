import ajax from './ajax'
import render from './render'
import bindEvent from './bind-event'

const DEFAULT_OPTS = {
  el: '#app',
  title: document.title,
  sep: ' - '
}

class Docsify {
  constructor (opts) {
    Docsify.installed = true

    this.opts = Object.assign({}, opts, DEFAULT_OPTS)
    this.opts.title = (this.opts.title ? this.opts.sep : '') + this.opts.title

    this.replace = true
    this.dom = document.querySelector(this.opts.el)
    if (!this.dom) {
      this.dom = document.body
      this.replace = false
    }
    this.loc = document.location.pathname
    if (/\/$/.test(this.loc)) this.loc += 'README'
    this.load()
  }

  load () {
    ajax(`${this.loc}.md`).then(res => {
      const target = res.target
      if (target.status >= 400) {
        this.render('not found')
      } else {
        this.render(res.target.response)
        bindEvent()
      }
    })
  }

  render (content) {
    document.title = this.loc.slice(1) + this.opts.sep + this.opts.title
    this.dom[this.replace ? 'outerHTML' : 'innerHTML'] = render(content)
  }
}

Docsify.use = function () {
  const plugin = arguments[0]
  if (typeof plugin === 'function') {
    plugin.call(Docsify)
  } else {
    throw TypeError('[docsify] Invalid plugin ' + plugin.name)
  }
}

window.addEventListener('load', () => {
  if (Docsify.installed) return
  new Docsify()
})

export default Docsify
