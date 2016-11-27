import ajax from './ajax'
import render from './render'
import bindEvent from './bind-event'

const DEFAULT_OPTS = {
  el: '#app',
  repo: '',
  'max-level': 6
}

const script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

if (script) {
  for (const prop in DEFAULT_OPTS) {
    DEFAULT_OPTS[prop] = script.getAttribute('data-' + prop) || DEFAULT_OPTS[prop]
  }
}

class Docsify {
  constructor (opts) {
    Docsify.installed = true

    this.opts = Object.assign({}, opts, DEFAULT_OPTS)

    this.replace = true
    this.dom = document.querySelector(this.opts.el)
    if (!this.dom) {
      this.dom = document.body
      this.replace = false
    }
    this.loc = document.location.pathname
    if (/\/$/.test(this.loc)) this.loc += 'README'
    this.load()

    const nav = document.querySelector('nav')
    if (nav) this.activeNav(nav)
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
    this.dom[this.replace ? 'outerHTML' : 'innerHTML'] = render(content, this.opts)
  }

  activeNav (elm) {
    const host = document.location.origin + document.location.pathname

    ;[].slice.call(elm.querySelectorAll('a')).forEach(node => {
      if (node.href === host) {
        node.setAttribute('class', 'active')
      }
    })
  }
}

window.addEventListener('load', () => {
  if (Docsify.installed) return
  new Docsify()
})

export default Docsify
