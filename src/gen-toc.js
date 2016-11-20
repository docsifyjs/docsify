/**
 * @link from https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
 */
const tocToTree = function (toc) {
  const headlines = []
  const last = {}

  toc.forEach(headline => {
    const level = headline.level || 1
    const len = level - 1

    if (last[len]) {
      last[len].children = last[len].children || []
      last[len].children.push(headline)
    } else {
      headlines.push(headline)
      last[level] = headline
    }
  })

  return headlines
}

const buildHeadlinesTree = function (tree, tpl = '') {
  if (!tree || !tree.length) return ''

  tree.forEach((node) => {
    tpl += `<li><a class="section-link" href="#${node.slug}">${node.title}</a></li>`
    if (node.children) {
      tpl += `<li><ul class="children">${buildHeadlinesTree(node.children)}</li>`
    }
  })

  return tpl + '</ul>'
}

export default function (toc) {
  return buildHeadlinesTree(tocToTree(toc), '<ul>')
}
