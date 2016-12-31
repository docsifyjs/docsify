import { isMobile } from './util'

/**
 * Active sidebar when scroll
 * @link https://buble.surge.sh/
 */
export function scrollActiveSidebar () {
  if (isMobile()) return

  const anchors = document.querySelectorAll('.anchor')
  const nav = {}
  const lis = document.querySelectorAll('.sidebar li')
  let active = null

  for (let i = 0, len = lis.length; i < len; i += 1) {
    const li = lis[i]
    let href = li.querySelector('a').getAttribute('href')

    if (href !== '/') {
      const match = href.match('#([^#]+)$')
      if (match && match.length) href = match[0].slice(1)
    }

    nav[decodeURIComponent(href)] = li
  }

  function highlight () {
    for (let i = 0, len = anchors.length; i < len; i += 1) {
      const node = anchors[i]
      const bcr = node.getBoundingClientRect()

      if (bcr.top < 10 && bcr.bottom > 10) {
        const li = nav[node.getAttribute('data-id')]

        if (!li || li === active) return
        if (active) active.setAttribute('class', '')

        li.setAttribute('class', 'active')
        active = li

        return
      }
    }
  }

  window.removeEventListener('scroll', highlight)
  window.addEventListener('scroll', highlight)
  highlight()
}

export function scrollIntoView () {
  const id = window.location.hash.match(/#[^#\/]+$/g)
  if (!id || !id.length) return
  const section = document.querySelector(decodeURIComponent(id[0]))

  if (section) section.scrollIntoView()
}

/**
 * Acitve link
 */
export function activeLink (dom, activeParent) {
  const host = window.location.href

  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  if (!dom) return
  let target

  ;[].slice.call(dom.querySelectorAll('a'))
    .sort((a, b) => b.href.length - a.href.length)
    .forEach(node => {
      if (host.indexOf(node.href) === 0 && !target) {
        activeParent
          ? node.parentNode.setAttribute('class', 'active')
          : node.setAttribute('class', 'active')
        target = node
      } else {
        activeParent
          ? node.parentNode.removeAttribute('class')
          : node.removeAttribute('class')
      }
    })

  return target
}

/**
 * sidebar toggle
 */
export function bindToggle (dom) {
  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  if (!dom) return
  const body = document.body

  dom.addEventListener('click', () => body.classList.toggle('close'))

  if (isMobile()) {
    document.querySelector('aside')
      .addEventListener('click', _ => body.classList.toggle('close'))
  }
}

export function scroll2Top () {
  document.body.scrollTop = 0
}

export function sticky () {
  const dom = document.querySelector('section.cover')
  const coverHeight = dom.getBoundingClientRect().height

  return (function () {
    if (window.pageYOffset >= coverHeight || dom.classList.contains('hidden')) {
      document.body.classList.add('sticky')
    } else {
      document.body.classList.remove('sticky')
    }
  })()
}
