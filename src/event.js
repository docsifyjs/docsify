import { isMobile } from './util'

/**
 * Active sidebar when scroll
 * @link https://buble.surge.sh/
 */
export function scrollActiveSidebar () {
  if (isMobile()) return

  let hoveredOverSidebar = false
  const anchors = document.querySelectorAll('.anchor')
  const sidebar = document.querySelector('aside.sidebar')
  const nav = {}
  const lis = sidebar.querySelectorAll('li')
  let active = sidebar.querySelector('li.active')

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
    const top = document.body.scrollTop
    let last

    for (let i = 0, len = anchors.length; i < len; i += 1) {
      const node = anchors[i]

      if (node.offsetTop > top) {
        if (!last) last = node
        break
      } else {
        last = node
      }
    }
    if (!last) return
    const li = nav[last.getAttribute('data-id')]

    if (!li || li === active) return
    if (active) active.classList.remove('active')

    li.classList.add('active')
    active = li
    !hoveredOverSidebar && !sticky.noSticky && active.scrollIntoView()
  }

  window.removeEventListener('scroll', highlight)
  window.addEventListener('scroll', highlight)
  sidebar.addEventListener('mouseover', () => { hoveredOverSidebar = true })
  sidebar.addEventListener('mouseleave', () => { hoveredOverSidebar = false })
}

export function scrollIntoView () {
  const id = window.location.hash.match(/#[^#\/]+$/g)
  if (!id || !id.length) return
  const section = document.querySelector(decodeURIComponent(id[0]))

  if (section) setTimeout(() => section.scrollIntoView(), 0)

  return section
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
          ? node.parentNode.classList.add('active')
          : node.classList.add('active')
        target = node
      } else {
        activeParent
          ? node.parentNode.classList.remove('active')
          : node.classList.remove('active')
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
    const sidebar = document.querySelector('aside.sidebar')
    document.body.addEventListener('click', e => {
      if (e.target !== dom && !dom.contains(e.target)) body.classList.toggle('close')
      if (sidebar.contains(e.target)) setTimeout(() => activeLink(sidebar, true), 0)
    })
  }
}

export function scroll2Top (offset = 0) {
  document.body.scrollTop = offset === true ? 0 : Number(offset)
}

export function sticky () {
  sticky.dom = sticky.dom || document.querySelector('section.cover')
  const coverHeight = sticky.dom.getBoundingClientRect().height

  return (function () {
    if (window.pageYOffset >= coverHeight || sticky.dom.classList.contains('hidden')) {
      document.body.classList.add('sticky')
      sticky.noSticky = false
    } else {
      document.body.classList.remove('sticky')
      sticky.noSticky = true
    }
  })()
}
