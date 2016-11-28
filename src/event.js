
/**
 * Active sidebar when scroll
 */
export function scrollActiveSidebar () {
  if (/mobile/i.test(navigator.userAgent)) return

  const anchors = document.querySelectorAll('.anchor')
  const nav = {}
  const lis = document.querySelectorAll('.sidebar li')
  let active = null

  for (let i = 0, len = lis.length; i < len; i += 1) {
    const li = lis[i]
    const a = li.querySelector('a')

    nav[a.getAttribute('href').slice(1)] = li
  }

  function highlight () {
    for (let i = 0, len = anchors.length; i < len; i += 1) {
      const node = anchors[i].parentNode
      const bcr = node.getBoundingClientRect()

      if (bcr.top < 10 && bcr.bottom > 10) {
        const li = nav[node.id]

        if (!li) return
        if (li === active) return
        if (active) active.setAttribute('class', '')

        li.setAttribute('class', 'active')
        active = li

        return
      }
    }
  }

  document.querySelector('main .content').addEventListener('scroll', highlight)
  highlight()

  function scrollIntoView () {
    const id = window.location.hash.slice(1)
    if (!id) return
    const section = document.querySelector('#' + id)

    if (section) section.scrollIntoView()
  }

  window.addEventListener('hashchange', scrollIntoView)
  scrollIntoView()
}

/**
 * Acitve link
 */
export function activeLink (dom, activeParent) {
  const host = document.location.origin + document.location.pathname

  dom = typeof dom === 'object' ? dom : document.querySelector(dom)
  if (!dom) return

  ;[].slice.call(dom.querySelectorAll('a')).forEach(node => {
    if (node.href === host) {
      activeParent
        ? node.parentNode.setAttribute('class', 'active')
        : node.setAttribute('class', 'active')
    }
  })
}
