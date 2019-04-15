import {getAndRemoveConfig} from '../compiler'
import {isAbsolutePath} from '../../router/util'

export const linkCompiler = ({renderer, router, linkTarget, compilerClass}) => renderer.link = (href, title = '', text) => {
  let attrs = ''

  const {str, config} = getAndRemoveConfig(title)
  title = str

  if (!isAbsolutePath(href) && !compilerClass._matchNotCompileLink(href) && !config.ignore) {
    if (href === compilerClass.config.homepage) {
      href = 'README'
    }
    href = router.toURL(href, null, router.getCurrentPath())
  } else {
    attrs += href.indexOf('mailto:') === 0 ? '' : ` target="${linkTarget}"`
  }

  if (config.target) {
    attrs += ' target=' + config.target
  }

  if (config.disabled) {
    attrs += ' disabled'
    href = 'javascript:void(0)'
  }

  if (config.class) {
    attrs += ` class="${config.class}"`
  }

  if (config.id) {
    attrs += ` id="${config.id}"`
  }

  if (title) {
    attrs += ` title="${title}"`
  }

  return `<a href="${href}"${attrs}>${text}</a>`
}
