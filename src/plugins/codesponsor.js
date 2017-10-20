const DEFAULT_OPTIONS = {
  theme: 'light',
  image: 'show'
}

function tpl (id, options) {
  const qs = []

  for (const key in options) {
    qs.push(`${key}=${options[key]}`)
  }

  const div = Docsify.dom.create('div')

  Docsify.dom.toggleClass(div, 'codesponsor')
  div.innerHTML = `<iframe
      scrolling=0
      frameborder=0
      width=250
      height=auto
      style="max-height: 250px;"
      id="code-sponsor-embed-iframe"
      src="https://app.codesponsor.io/widgets/${id}?${qs.join('&')}">
    </iframe>`

  return div
}

function appIframe (id, opts) {
  const html = tpl(id, opts)

  Docsify.dom.before(Docsify.dom.find('section.content'), html)
}

function appendStyle () {
  Docsify.dom.style(`
    .codesponsor {
      position: relative;
      float: right;
      right: 10px;
      top: 10px;
    }

    @media screen and (min-width: 1600px) {
      body.sticky .codesponsor {
        position: fixed;
      }

      .codesponsor {
        position: absolute;
        bottom: 10px;
        top: auto;
        float: none;
      }
    }
  `)
}

const install = function (hook, vm) {
  let config = vm.config.codesponsor
  let id

  if (typeof config === 'string') {
    id = config
    config = {}
  } else {
    id = config.id
  }

  const opts = Docsify.util.merge(DEFAULT_OPTIONS, config)

  if (!id) {
    throw Error('codesponsor plugin need id')
  }

  if (Docsify.util.isMobile) {
    return
  }

  // Append style
  hook.ready(() => {
    appendStyle()
    appIframe(id, opts)
  })
}

window.$docsify.plugins = [].concat(install, window.$docsify.plugins)
