var rollup = require('rollup')
var buble = require('rollup-plugin-buble')

var build = function (entry, moduleName) {
  rollup
    .rollup({
      entry: 'src/' + entry,
      plugins: [buble()]
    })
    .then(function (bundle) {
      bundle.write({
        globals: {
          marked: 'marked',
          prismjs: 'Prism'
        },
        format: 'umd',
        moduleName: moduleName,
        dest: 'lib/' + entry
      })
    })
}

build('docsify.js', 'Docsify')
build('plugins/nav.js', 'Docsify.Nav')
