import rollup from 'rollup'
import buble from 'rollup-plugin-buble'
import async from 'rollup-plugin-async'
import replace from 'rollup-plugin-replace'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(dir, '..', 'package.json')).toString())

rollup
  .rollup({
    input: 'packages/docsify-server-renderer/index.js',
    plugins: [
      async(),
      replace({
        __VERSION__: process.env.VERSION || pkg.version,
        'process.env.SSR': true
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
    return bundle.write({
      format: 'cjs',
      file: dest
    })
  })
  .catch(function (err) {
    console.error(err)
    process.exit(1)
  })
