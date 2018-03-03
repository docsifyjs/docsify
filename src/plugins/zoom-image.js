import mediumZoom from 'medium-zoom'

function install(hook) {
  let zoom

  hook.doneEach(_ => {
    if (zoom) {
      zoom.detach()
    }

    zoom = mediumZoom('img:not(.emoji):not([data-no-zoom])')
  })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
