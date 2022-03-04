const AllGithubEmoji = {};

// Emoji from GitHub API
// https://api.github.com/emojis
window.emojify = function (match, $1) {
  return Object.prototype.hasOwnProperty.call(AllGithubEmoji, $1) === false
    ? match
    : '<img class="emoji" src="https://github.githubassets.com/images/icons/emoji/' +
        AllGithubEmoji[$1] +
        '.png" alt="' +
        $1 +
        '" />';
};
