var fs = require('fs')
var cssnano = require('cssnano').process
var resolve = require('path').resolve

var save = function (file, content) {
  fs.writeFileSync(resolve(__dirname, '../lib/themes/', file), content)
}
var load = function (file) {
  return fs.readFileSync(resolve(__dirname, '../themes/', file)).toString()
}

var list = fs.readdirSync(resolve(__dirname, '../themes'))

list.forEach(function (file) {
  cssnano(load(file))
    .then(function (result) {
      save(file, result.css)
      console.log('cssnao - ' + file)
    })
})
