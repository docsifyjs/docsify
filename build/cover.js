// @ts-check

import fs from 'fs'
import path from 'path'

const read = fs.readFileSync
const write = fs.writeFileSync
const dirname = path.dirname(import.meta.url.replace('file://', ''));
const version =
  process.env.VERSION ||
  JSON.parse(fs.readFileSync(path.resolve(dirname, '..', 'package.json')).toString())
    .version;

const file = dirname + '/../docs/_coverpage.md'
let cover = read(file, 'utf8').toString()

console.log('Replace version number in cover page...')
cover = cover.replace(
  /<small>(\S+)?<\/small>/g,
  '<small>' + version + '</small>'
)
write(file, cover)
