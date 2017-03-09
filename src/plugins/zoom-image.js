import zoom from 'zoom-image'
import style from 'zoom-image/css/zoom-image.css'

function install (hook) {
  const dom = Docsify.dom
  let destroys

  // add style
  dom.appendTo(dom.head, dom.create('style', style))

  hook.doneEach(_ => {
    const images = dom.findAll('img:not(.emoji)')

    if (Array.isArray(destroys) && destroys.length) {
      destroys.forEach(o => o())
      destroys = []
    }

    destroys = images.map(zoom)
  })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
