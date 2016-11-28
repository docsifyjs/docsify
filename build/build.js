var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')

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
        moduleName: opts.moduleName || 'Docsify',
        dest: dest
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

build({
  entry: 'index.js',
  output: 'docsify.js',
  plugins: [commonjs(), nodeResolve()]
})
build({
  entry: 'index.js',
  output: 'docsify.min.js',
  plugins: [commonjs(), nodeResolve(), uglify()]
})
