import ajax from './ajax'
import render from './render'

class Docsify {
  constructor (opts = {}) {
    Docsify.installed = true

    this.dom = document.querySelector(opts.el || 'body')
    this.loc = document.location.pathname
    this.loc = this.loc === '/' ? 'README' : this.loc
    this.load()
  }

  load () {
    ajax(`${this.loc}.md`).then(res => {
      const target = res.target
      if (target.status >= 400) {
        this.render('not found')
      } else {
        this.render(res.target.response)
      }
    })
  }

  render (content) {
    this.dom.innerHTML = render(content)
  }
}

window.addEventListener('load', () => {
  if (Docsify.installed) return
  new Docsify()
})

export default Docsify
