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
        globals: !opts.inline ? {
          marked: 'marked',
          prismjs: 'Prism'
        } : {},
        format: 'umd',
        moduleName: opts.moduleName || 'Docsify',
        dest: dest
      })
    })
}

build({
  entry: 'docsify.js'
})
build({
  entry: 'docsify.js',
  output: 'docsify.min.js',
  plugins: [uglify()]
})
build({
  entry: 'docsify.js',
  output: 'docsify.pack.js',
  plugins: [commonjs(), nodeResolve()],
  inline: false
})
build({
  entry: 'docsify.js',
  output: 'docsify.pack.min.js',
  plugins: [commonjs(), nodeResolve(), uglify()],
  inline: false
})
