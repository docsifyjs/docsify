export function emojify (text) {
  return text
    .replace(/<(pre|template)[^>]*?>([\s\S]+)<\/(pre|template)>/g, m => m.replace(/:/g, '__colon__'))
    .replace(/:(\w+?):/ig, '<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/$1.png" alt="$1" />')
    .replace(/__colon__/g, ':')
}
