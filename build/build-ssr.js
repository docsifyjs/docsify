var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var isProd = process.argv[process.argv.length - 1] !== '--dev'

rollup
  .rollup({
    entry: 'packages/docsify-server-renderer/index.js',
    plugins: [
      babel({
        presets: [
          [
            'es2015',
            {
              modules: false
            }
          ]
        ]
      })
    ],
    onwarn: function() {}
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
