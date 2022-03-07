import emojiData from '../core/render/emoji-data.js';

// Deprecation notice
if (window && window.console) {
  console.info('Docsify emoji plugin has been deprecated as of v4.13');
}

// Emoji from GitHub API
window.emojify = function (match, $1) {
  return Object.prototype.hasOwnProperty.call(emojiData.data, $1) === false
    ? match
    : `<img src="${emojiData.baseURL}${emojiData.data[$1]}" alt="${$1}" class="emoji" />`;
};
