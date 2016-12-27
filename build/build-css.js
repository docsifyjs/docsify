var fs = require('fs')
var cssnano = require('cssnano').process
var resolve = require('path').resolve
var postcss = require('postcss')

var processor = postcss([require('postcss-salad')])

var saveMin = function (file, content) {
  fs.writeFileSync(resolve(__dirname, '../public/lib/themes/', file), content)
}
var save = function (file, content) {
  fs.writeFileSync(resolve(__dirname, '../themes/', file), content)
}
var load = function (file) {
  return fs.readFileSync(resolve(__dirname, '../src/themes/', file)).toString()
}
var loadLib = function (file) {
  return fs.readFileSync(resolve(__dirname, '../themes/', file)).toString()
}

var list = fs.readdirSync(resolve(__dirname, '../src/themes'))

list.forEach(function (file) {
  if (!/\.css$/.test(file)) return
  processor.process(load(file), { from: resolve(__dirname, '../src/themes/', file) })
    .then(function (result) {
      save(file, result.css)
      console.log('salad - ' + file)
      cssnano(loadLib(file))
        .then(function (result) {
          saveMin(file, result.css)
          console.log('cssnao - ' + file)
        })
    }).catch(function (err) {
      console.log(err)
    })
})

