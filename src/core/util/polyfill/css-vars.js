import { dom } from '../dom'
import { get } from '../../fetch/ajax'

function replaceVar (block, themeColor) {
  block.innerHTML = block.innerHTML
    .replace(/var\(\s*--theme-color.*?\)/g, themeColor)
}

export default function (themeColor) {
  // Variable support
  if (window.CSS
      && window.CSS.supports
      && window.CSS.supports('(--foo: red)')) return

  const styleBlocks = dom.findAll('style:not(.inserted),link')

  ;[].forEach.call(styleBlocks, block => {
    if (block.nodeName === 'STYLE') {
      replaceVar(block, themeColor)
    } else if (block.nodeName === 'LINK') {
      const href = block.getAttribute('href')

      if (!/\.css$/.test(href)) return

      get(href).then(res => {
        const style = dom.create('style', res)

        dom.head.appendChild(style)
        replaceVar(style, themeColor)
      })
    }
  })
}
