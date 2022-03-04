import emojiData from '../core/render/emojify-data';

// Deprecation notice
if (window && window.console) {
  console.info('Docsify emoji plugin has been deprecated as of v4.13');
}

// Emoji from GitHub API
// https://api.github.com/emojis
window.emojify = function (match, $1) {
  return Object.prototype.hasOwnProperty.call(emojiData, $1) === false
    ? match
    : '<img class="emoji" src="https://github.githubassets.com/images/icons/emoji/' +
        emojiData[$1] +
        '.png" alt="' +
        $1 +
        '" />';
};
