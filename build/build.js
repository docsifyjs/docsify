const rollup = require('rollup')
const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')
const replace = require('rollup-plugin-replace')
const isProd = process.env.NODE_ENV === 'production'
const version = process.env.VERSION || require('../package.json').version
const chokidar = require('chokidar')
const path = require('path')

const build = function (opts) {
  rollup
    .rollup({
      input: opts.input,
      plugins: (opts.plugins || []).concat([
        buble(),
        commonjs(),
        nodeResolve(),
        replace({
          __VERSION__: version,
          'process.env.SSR': false
        })
      ])
    })
    .then(function (bundle) {
      var dest = 'lib/' + (opts.output || opts.input)

      console.log(dest)
      bundle.write({
        format: 'iife',
        file: dest,
        strict: false
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}
const buildCore = function () {
  build({
    input: 'src/core/index.js',
    output: 'docsify.js'
  })

  if (isProd) {
    build({
      input: 'src/core/index.js',
      output: 'docsify.min.js',
      plugins: [uglify()]
    })
  }
}
const buildAllPlugin = function () {
  var plugins = [
    {name: 'search', input: 'search/index.js'},
    {name: 'ga', input: 'ga.js'},
    {name: 'matomo', input: 'matomo.js'},
    {name: 'emoji', input: 'emoji.js'},
    {name: 'external-script', input: 'external-script.js'},
    {name: 'front-matter', input: 'front-matter/index.js'},
    {name: 'zoom-image', input: 'zoom-image.js'},
    {name: 'disqus', input: 'disqus.js'},
    {name: 'gitalk', input: 'gitalk.js'}
  ]

  plugins.forEach(item => {
    build({
      input: 'src/plugins/' + item.input,
      output: 'plugins/' + item.name + '.js'
    })
  })

  if (isProd) {
    plugins.forEach(item => {
      build({
        input: 'src/plugins/' + item.input,
        output: 'plugins/' + item.name + '.min.js',
        plugins: [uglify()]
      })
    })
  }
}

if (!isProd) {
  chokidar
    .watch(['src/core', 'src/plugins'], {
      atomic: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    })
    .on('change', p => {
      console.log('[watch] ', p)
      const dirs = p.split(path.sep)
      if (dirs[1] === 'core') {
        buildCore()
      } else if (dirs[2]) {
        const name = path.basename(dirs[2], '.js')
        const input = `src/plugins/${name}${
          /\.js/.test(dirs[2]) ? '' : '/index'
        }.js`

        build({
          input,
          output: 'plugins/' + name + '.js'
        })
      }
    })
    .on('ready', () => {
      console.log('[start]')
      buildCore()
      buildAllPlugin()
    })
} else {
  buildCore()
  buildAllPlugin()
}
