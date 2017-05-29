// From https://github.com/egoist/vue-ga/blob/master/src/index.js
function appendScript () {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.google-analytics.com/analytics.js'
  document.body.appendChild(script)
}

function init (id) {
  let ga = window.ga

  if (!ga) {
    appendScript()
    ga = ga || function () {
      (ga.q = ga.q || []).push(arguments)
    }
    ga.l = Number(new Date())
    ga('create', id, 'auto')
  }
  return ga
}

function collect () {
  const ga = init($docsify.ga)

  ga('set', 'page', location.hash)
  ga('send', 'pageview')
}

const install = function (hook) {
  if (!$docsify.ga) {
    console.error('[Docsify] ga is required.')
    return
  }

  hook.beforeEach(collect)
}

$docsify.plugins = [].concat(install, $docsify.plugins)
