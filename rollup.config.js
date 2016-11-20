import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'lib/docsify.js',
  plugins: [buble()],
  globals: {
    marked: 'marked',
    prismjs: 'Prism'
  },
  format: 'umd',
  moduleName: 'Docsify'
}
