let cache = {}
const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g

export function slugify (str) {
  if (typeof str !== 'string') return ''

  str = /^[\w\s]+$/g.test(str) ? str.toLowerCase() : str

  let slug = str
    .trim()
    .replace(/<[^>\d]+>/g, '')
    .replace(re, '')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-')
    .replace(/^(\d)/, '_$1')
  let count = cache[slug]

  count = cache.hasOwnProperty(slug) ? count + 1 : 0
  cache[slug] = count

  if (count) {
    slug = slug + '-' + count
  }

  return slug
}

slugify.clear = function () {
  cache = {}
}
