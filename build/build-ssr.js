var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var async = require('rollup-plugin-async')
var replace = require('rollup-plugin-replace')

rollup
  .rollup({
    entry: 'packages/docsify-server-renderer/index.js',
    plugins: [
      async(),
      replace({
        __VERSION__: process.env.VERSION || require('../package.json').version
      }),
      buble({
        transforms: {
          generator: false
        }
      })
    ],
    onwarn: function () {}
  })
  .then(function (bundle) {
    var dest = 'packages/docsify-server-renderer/build.js'

    console.log(dest)
    bundle.write({
      format: 'cjs',
      dest: dest
    })
  })
  .catch(function (err) {
    console.error(err)
  })
