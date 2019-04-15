import {getAndRemoveConfig} from '../compiler'
import {isAbsolutePath, getPath, getParentPath} from '../../router/util'

export const imageCompiler = ({renderer, contentBase, router}) => renderer.image = (href, title, text) => {
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
      attrs += ' width=' + sizes[0] + ' height=' + sizes[1]
    } else {
      attrs += ' width=' + sizes[0]
    }
  }

  if (config.class) {
    attrs += ` class="${config.class}"`
  }

  if (config.id) {
    attrs += ` id="${config.id}"`
  }

  if (!isAbsolutePath(href)) {
    url = getPath(contentBase, getParentPath(router.getCurrentPath()), href)
  }

  return `<img src="${url}"data-origin="${href}" alt="${text}"${attrs}>`
}

