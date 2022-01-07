var rollup = require('rollup')
var babel = require('@rollup/plugin-babel').default
var async = require('rollup-plugin-async')
var replace = require('@rollup/plugin-replace')

rollup
  .rollup({
    input: 'packages/docsify-server-renderer/index.js',
    plugins: [
      async(),
      replace({
        __VERSION__: process.env.VERSION || require('../package.json').version,
        'process.env.SSR': true
      }),
      babel({
        babelHelpers: "bundled",
        presets: ['babel-preset-solid']
      }),
    ],
    onwarn: function () {}
  })
  .then(function (bundle) {
    var dest = 'packages/docsify-server-renderer/build.js'

    console.log(dest)
    return bundle.write({
      format: 'cjs',
      file: dest
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })
