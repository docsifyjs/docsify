import { load } from './util'

function replaceVar (block) {
  block.innerHTML = block.innerHTML.replace(/var\(\s*--theme-color.*?\)/g, __docsify__.themeColor)
}

export function cssVars () {
  // variable support
  if (window.CSS && window.CSS.supports && window.CSS.supports('(--foo: red)')) return

  const styleBlocks = document.querySelectorAll('style:not(.inserted),link')

  ;[].forEach.call(styleBlocks, block => {
    if (block.nodeName === 'STYLE') {
      replaceVar(block)
    } else if (block.nodeName === 'LINK') {
      const href = block.getAttribute('href')

      if (/\.css$/.test(href)) return

      load(href).then(res => {
        const style = document.createElement('style')

        style.innerHTML = res
        document.head.appendChild(style)
        replaceVar(style)
      })
    }
  })
}
