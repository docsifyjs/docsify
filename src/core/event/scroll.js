import { isMobile } from '../util/env'
import * as dom from '../util/dom'
import { parse } from '../route/hash'

const nav = {}
let hoverOver = false

function highlight () {
  const sidebar = dom.getNode('.sidebar')
  const anchors = dom.findAll('.anchor')
  const wrap = dom.find(sidebar, '.sidebar-nav')
  let active = dom.find(sidebar, 'li.active')
  const top = dom.body.scrollTop
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

  active && active.classList.remove('active')
  li.classList.add('active')
  active = li

  // scroll into view
  // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
  if (!hoverOver && dom.body.classList.contains('sticky')) {
    const height = sidebar.clientHeight
    const curOffset = 0
    const cur = active.offsetTop + active.clientHeight + 40
    const isInView = (
      active.offsetTop >= wrap.scrollTop &&
      cur <= wrap.scrollTop + height
    )
    const notThan = cur - curOffset < height
    const top = isInView
      ? wrap.scrollTop
      : notThan
        ? curOffset
        : cur - height

    sidebar.scrollTop = top
  }
}

export function scrollActiveSidebar () {
  if (isMobile) return

  const sidebar = dom.getNode('.sidebar')
  const lis = dom.findAll(sidebar, 'li')

  for (let i = 0, len = lis.length; i < len; i += 1) {
    const li = lis[i]
    const a = li.querySelector('a')
    if (!a) continue
    let href = a.getAttribute('href')

    if (href !== '/') {
      href = parse(href).query.id
    }

    nav[decodeURIComponent(href)] = li
  }

  dom.off('scroll', highlight)
  dom.on('scroll', highlight)
  dom.on(sidebar, 'mouseover', () => { hoverOver = true })
  dom.on(sidebar, 'mouseleave', () => { hoverOver = false })
}

export function scrollIntoView (id) {
  const section = dom.find('#' + id)
  section && section.scrollIntoView()
}

const scrollEl = dom.$.scrollingElement || dom.$.documentElement

export function scroll2Top (offset = 0) {
  scrollEl.scrollTop = offset === true ? 0 : Number(offset)
}
