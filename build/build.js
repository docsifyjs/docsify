var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var nodeResolve = require('rollup-plugin-node-resolve')
var string = require('rollup-plugin-string')
var uglify = require('rollup-plugin-uglify')
var isProd = process.argv[process.argv.length - 1] !== '--dev'

var build = function (opts) {
  rollup
    .rollup({
      entry: 'src/' + opts.entry,
      plugins: (opts.plugins || []).concat([
        string({ include: '**/*.css' }),
        buble(),
        commonjs(),
        nodeResolve()
      ])
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
  output: 'docsify.js'
})

var plugins = [
  { name: 'search', entry: 'search/index.js', moduleName: 'Search' },
  { name: 'ga', entry: 'ga.js', moduleName: 'GA' },
  { name: 'emoji', entry: 'emoji.js', moduleName: 'Emoji' },
  { name: 'external-script', entry: 'external-script.js', moduleName: 'ExternalScript' },
  { name: 'front-matter', entry: 'front-matter/index.js', moduleName: 'FrontMatter' },
  { name: 'zoom-image', entry: 'zoom-image.js', moduleName: 'ZoomImage' }
]

plugins.forEach(item => {
  build({
    entry: 'plugins/' + item.entry,
    output: 'plugins/' + item.name + '.js',
    moduleName: 'D.' + item.moduleName
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
      moduleName: 'D.' + item.moduleName,
      plugins: [uglify()]
    })
  })
}
