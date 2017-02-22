import * as util from './util'
import * as dom from './util/dom'
import * as render from './render/compiler'
import * as route from './route/hash'
import { slugify } from './render/slugify'
import { get } from './fetch/ajax'
import marked from 'marked'
import prism from 'prismjs'

export default function () {
  window.Docsify = { util, dom, render, route, get, slugify }
  window.marked = marked
  window.Prism = prism
}
