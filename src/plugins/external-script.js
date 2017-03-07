function handleExternalScript () {
  const container = Docsify.dom.getNode('#main')
  const script = Docsify.dom.find(container, 'script')

  if (script && script.src) {
    const newScript = document.createElement('script')

    ;['src', 'async', 'defer'].forEach(attribute => {
      newScript[attribute] = script[attribute]
    })

    script.parentNode.removeChild(script)
    container.appendChild(newScript)
  }
}

const install = function (hook) {
  hook.doneEach(handleExternalScript)
}

window.$docsify.plugins = [].concat(install, window.$docsify.plugins)
