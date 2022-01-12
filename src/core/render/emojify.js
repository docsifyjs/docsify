import { inBrowser } from '../util/env';

export function emojify(text) {
  if (!window.emojify) {
    return text.replace(/__colon__/g, ':');
  }

  return text
    .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, m =>
      m.replace(/:/g, '__colon__')
    )
    .replace(/:([a-z0-9_\-\+]+?):/g, inBrowser && window.emojify)
    .replace(/__colon__/g, ':');
}
