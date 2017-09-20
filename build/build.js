var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var nodeResolve = require('rollup-plugin-node-resolve')
var string = require('rollup-plugin-string')
var uglify = require('rollup-plugin-uglify')
var replace = require('rollup-plugin-replace')
var isProd = process.argv[process.argv.length - 1] !== '--dev'
var version = process.env.VERSION || require('../package.json').version

var build = function (opts) {
  rollup
    .rollup({
      entry: 'src/' + opts.entry,
      plugins: (opts.plugins || []).concat([
        string({ include: '**/*.css' }),
        buble(),
        commonjs(),
        nodeResolve(),
        replace({
          __VERSION__: version
        })
      ])
    })
    .then(function (bundle) {
      var dest = 'lib/' + (opts.output || opts.entry)

      console.log(dest)
      bundle.write({
        format: 'iife',
        dest: dest
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

build({
  entry: 'core/index.js',
  output: 'docsify.js'
})

var plugins = [
  { name: 'search', entry: 'search/index.js' },
  { name: 'ga', entry: 'ga.js' },
  { name: 'emoji', entry: 'emoji.js' },
  { name: 'external-script', entry: 'external-script.js' },
  { name: 'front-matter', entry: 'front-matter/index.js' },
  { name: 'zoom-image', entry: 'zoom-image.js' },
  { name: 'codesponsor', entry: 'codesponsor.js' }
]

plugins.forEach(item => {
  build({
    entry: 'plugins/' + item.entry,
    output: 'plugins/' + item.name + '.js'
  })
})

if (isProd) {
  build({
    entry: 'core/index.js',
    output: 'docsify.min.js',
    plugins: [uglify()]
  })
  plugins.forEach(item => {
    build({
      entry: 'plugins/' + item.entry,
      output: 'plugins/' + item.name + '.min.js',
      plugins: [uglify()]
    })
  })
}
