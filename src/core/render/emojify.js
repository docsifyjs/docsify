import emojiData from './emoji-data.js';

function replaceEmojiShorthand(m, $1, useNativeEmoji) {
  const emojiMatch = emojiData.data[$1];

  let result = m;

  if (emojiMatch) {
    if (useNativeEmoji && /unicode/.test(emojiMatch)) {
      const emojiUnicode = emojiMatch
        .replace('unicode/', '')
        .replace(/\.png.*/, '')
        .split('-')
        .map(u => `&#x${u};`)
        // Separate multi-character emoji with zero width joiner sequence (ZWJ)
        // Hat tip: https://about.gitlab.com/blog/2018/05/30/journey-in-native-unicode-emoji/#emoji-made-up-of-multiple-characters
        .join('&zwj;')
        .concat('&#xFE0E;');
      result = /* html */ `<span class="emoji">${emojiUnicode}</span>`;
    } else {
      result = /* html */ `<img src="${emojiData.baseURL}${emojiMatch}.png" alt="${$1}" class="emoji" loading="lazy">`;
    }
  }

  return result;
}

export function emojify(text, useNativeEmoji) {
  return (
    text
      // Mark colons in tags
      .replace(
        /<(code|pre|script|template)[^>]*?>[\s\S]+?<\/(code|pre|script|template)>/g,
        m => m.replace(/:/g, '__colon__'),
      )
      // Mark colons in comments
      .replace(/<!--[\s\S]+?-->/g, m => m.replace(/:/g, '__colon__'))
      // Mark colons in URIs
      .replace(/([a-z]{2,}:)?\/\/[^\s'">)]+/gi, m =>
        m.replace(/:/g, '__colon__'),
      )
      // Replace emoji shorthand codes
      .replace(/:([a-z0-9_\-+]+?):/g, (m, $1) =>
        replaceEmojiShorthand(m, $1, useNativeEmoji),
      )
      // Restore colons in tags and comments
      .replace(/__colon__/g, ':')
  );
}
