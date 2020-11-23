const cssnano = require('cssnano').process
const path = require('path')
const fs = require('fs')

files = fs.readdirSync(path.resolve('lib/themes'))

files.forEach(file => {
  file = path.resolve('lib/themes', file)
  cssnano(fs.readFileSync(file)).then(result => {
    fs.writeFileSync(file, result.css)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
})
