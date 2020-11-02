import _cssnano from 'cssnano'
import path from 'path'
import fs from 'fs'

const cssnano = _cssnano.process

const files = fs.readdirSync(path.resolve('lib/themes'))

files.forEach(file => {
  file = path.resolve('lib/themes', file)
  cssnano(fs.readFileSync(file)).then(result => {
    fs.writeFileSync(file, result.css)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
})
