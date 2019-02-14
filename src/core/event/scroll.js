import {isMobile} from '../util/env'
import * as dom from '../util/dom'
import Tweezer from 'tweezer.js'

const nav = {}
let hoverOver = false
let scroller = null
let enableScrollEvent = true
let coverHeight = 0

function scrollTo(el) {
  if (scroller) {
    scroller.stop()
  }
  enableScrollEvent = false
  scroller = new Tweezer({
    start: window.pageYOffset,
    end: el.getBoundingClientRect().top + window.pageYOffset,
    duration: 500
  })
    .on('tick', v => window.scrollTo(0, v))
    .on('done', () => {
      enableScrollEvent = true
      scroller = null
    })
    .begin()
}

function highlight(path) {
  if (!enableScrollEvent) {
    return
  }
  const sidebar = dom.getNode('.sidebar')
  const anchors = dom.findAll('.anchor')
  const wrap = dom.find(sidebar, '.sidebar-nav')
  let active = dom.find(sidebar, 'li.active')
  const doc = document.documentElement
  const top = ((doc && doc.scrollTop) || document.body.scrollTop) - coverHeight
  let last

  for (let i = 0, len = anchors.length; i < len; i += 1) {
    const node = anchors[i]

    if (node.offsetTop > top) {
      if (!last) {
        last = node
      }
      break
    } else {
      last = node
    }
  }
  if (!last) {
    return
  }
  const li = nav[getNavKey(decodeURIComponent(path), last.getAttribute('data-id'))]

  if (!li || li === active) {
    return
  }

  active && active.classList.remove('active')
  li.classList.add('active')
  active = li

  // Scroll into view
  // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
  if (!hoverOver && dom.body.classList.contains('sticky')) {
    const height = sidebar.clientHeight
    const curOffset = 0
    const cur = active.offsetTop + active.clientHeight + 40
    const isInView =
      active.offsetTop >= wrap.scrollTop && cur <= wrap.scrollTop + height
    const notThan = cur - curOffset < height
    const top = isInView ? wrap.scrollTop : notThan ? curOffset : cur - height

    sidebar.scrollTop = top
  }
}

function getNavKey(path, id) {
  return `${path}?id=${id}`
}

export function scrollActiveSidebar(router) {
  const cover = dom.find('.cover.show')
  coverHeight = cover ? cover.offsetHeight : 0

  const sidebar = dom.getNode('.sidebar')
  let lis = []
  if (sidebar != null) {
    lis = dom.findAll(sidebar, 'li')
  }

  for (let i = 0, len = lis.length; i < len; i += 1) {
    const li = lis[i]
    const a = li.querySelector('a')
    if (!a) {
      continue
    }
    let href = a.getAttribute('href')

    if (href !== '/') {
      const {query: {id}, path} = router.parse(href)
      if (id) {
        href = getNavKey(path, id)
      }
    }

    if (href) {
      nav[decodeURIComponent(href)] = li
    }
  }

  if (isMobile) {
    return
  }
  const path = router.getCurrentPath()
  dom.off('scroll', () => highlight(path))
  dom.on('scroll', () => highlight(path))
  dom.on(sidebar, 'mouseover', () => {
    hoverOver = true
  })
  dom.on(sidebar, 'mouseleave', () => {
    hoverOver = false
  })
}

export function scrollIntoView(path, id) {
  if (!id) {
    return
  }

  const section = dom.find('#' + id)
  section && scrollTo(section)

  const li = nav[getNavKey(path, id)]
  const sidebar = dom.getNode('.sidebar')
  const active = dom.find(sidebar, 'li.active')
  active && active.classList.remove('active')
  li && li.classList.add('active')
}

const scrollEl = dom.$.scrollingElement || dom.$.documentElement

export function scroll2Top(offset = 0) {
  scrollEl.scrollTop = offset === true ? 0 : Number(offset)
}
