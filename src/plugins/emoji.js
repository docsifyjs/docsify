import AllGithubEmoji from './emoji-aliases.js'

window.emojify = function (match, $1) {
  return AllGithubEmoji.indexOf($1) === -1 ?
    match :
    '<img class="emoji" src="https://assets-cdn.github.com/images/icons/emoji/' +
      $1 +
      '.png" alt="' +
      $1 +
      '" />'
}
