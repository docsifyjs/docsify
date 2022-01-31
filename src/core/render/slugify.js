import { hasOwn } from '../util/core';

let cache = {};
const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;

function lower(string) {
  return string.toLowerCase();
}

export function slugify(str) {
  if (typeof str !== 'string') {
    return '';
  }

  let slug = str
    .trim()
    .replace(/[A-Z]+/g, lower)
    .replace(/<[^>]+>/g, '')
    .replace(re, '')
    .replace(/\s/g, '-')
    .replace(/-+/g, '-')
    .replace(/^(\d)/, '_$1');
  let count = cache[slug];

  count = hasOwn.call(cache, slug) ? count + 1 : 0;
  cache[slug] = count;

  if (count) {
    slug = slug + '-' + count;
  }

  return slug;
}

slugify.clear = function () {
  cache = {};
};
