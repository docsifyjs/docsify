import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString())
var read = fs.readFileSync
var write = fs.writeFileSync
var version = process.env.VERSION || pkg.version

var file = __dirname + '/../docs/_coverpage.md'
var cover = read(file, 'utf8').toString()

console.log('Replace version number in cover page...')
cover = cover.replace(
  /<small>(\S+)?<\/small>/g,
  '<small>' + version + '</small>'
)
write(file, cover)
