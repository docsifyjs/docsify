var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')
var isProd = process.argv[process.argv.length - 1] !== '--dev'

var build = function (opts) {
  rollup
    .rollup({
      entry: 'src/' + opts.entry,
      plugins: [buble()].concat(opts.plugins || [])
    })
    .then(function (bundle) {
      var dest = 'lib/' + (opts.output || opts.entry)

      console.log(dest)
      bundle.write({
        format: 'iife',
        moduleName: opts.moduleName || 'D',
        dest: dest
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

build({
  entry: 'core/index.js',
  output: 'docsify.js',
  plugins: [commonjs(), nodeResolve()]
})

// build({
//   entry: 'plugins/search.js',
//   output: 'plugins/search.js',
//   moduleName: 'D.Search'
// })

// build({
//   entry: 'plugins/ga.js',
//   output: 'plugins/ga.js',
//   moduleName: 'D.GA'
// })

if (isProd) {
  build({
    entry: 'index.js',
    output: 'docsify.min.js',
    plugins: [commonjs(), nodeResolve(), uglify()]
  })
  build({
    entry: 'plugins/search.js',
    output: 'plugins/search.min.js',
    moduleName: 'D.Search',
    plugins: [uglify()]
  })
  build({
    entry: 'plugins/ga.js',
    output: 'plugins/ga.min.js',
    moduleName: 'D.GA',
    plugins: [uglify()]
  })
}
