const fs = require('fs')

const data = fs.readFileSync('/dev/stdin', 'utf-8')
const emoji = JSON.parse(data)

const AllGithubEmoji = []
for (let i = 0; i < emoji.length; i++) {
  let o = emoji[i]
  if (o.aliases) {
    AllGithubEmoji.push(...o.aliases)
  }
}

const str = `// All from github official gemoji repo
// see https://github.com/github/gemoji/blob/master/db/emoji.json
export default ${JSON.stringify(AllGithubEmoji)}
`

fs.writeFileSync(__dirname + '/../src/plugins/emoji-aliases.js', str)
