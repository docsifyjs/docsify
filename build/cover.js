var fs = require('fs')
var read = fs.readFileSync
var write = fs.writeFileSync
var version = process.env.VERSION || require('../package.json').version

var file = __dirname + '/../docs/_coverpage.md'
var cover = read(file, 'utf8').toString()

console.log('Replace version number in cover page...')
cover = cover.replace(
  /<small>(\S+)?<\/small>/g,
  '<small>' + version + '</small>'
)
write(file, cover)
