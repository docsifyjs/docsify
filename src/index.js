import { ajax } from './util'
import render from './render'
import { scrollActiveSidebar, activeLink } from './event'

const DEFAULT_OPTS = {
  el: '#app',
  repo: '',
  'max-level': 6,
  sidebar: ''
}
const script = document.currentScript || [].slice.call(document.getElementsByTagName('script')).pop()

// load configuration for script attribute
if (script) {
  for (const prop in DEFAULT_OPTS) {
    DEFAULT_OPTS[prop] = script.getAttribute('data-' + prop) || DEFAULT_OPTS[prop]
  }
}

class Docsify {
  constructor (opts) {
    this.opts = Object.assign({}, opts, DEFAULT_OPTS)
    if (this.opts.sidebar) this.opts.sidebar = window[this.opts.sidebar]

    this.run()
  }

  run () {
    const dom = document.querySelector(this.opts.el) || document.body
    const replace = dom !== document.body
    let loc = document.location.pathname

    const renderTo = (content = 'not found') => {
      dom[replace ? 'outerHTML' : 'innerHTML'] = render(content, this.opts)
    }

    if (/\/$/.test(loc)) loc += 'README'

    // active navbar
    activeLink('nav')

    // load markdown file
    ajax(`${loc}.md`)
    .then(({ target }) => {
      if (target.status >= 400) {
        return renderTo()
      }

      renderTo(target.response)
      this.opts.sidebar
        ? activeLink('aside.sidebar', true)
        : scrollActiveSidebar()
    })
    .catch(_ => renderTo())
  }
}

export default new Docsify()
