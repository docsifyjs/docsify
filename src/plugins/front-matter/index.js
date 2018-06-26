import parser from './parser'

const install = function (hook, vm) {
  hook.beforeEach(content => {
    const {attributes, body} = parser(content)

    vm.frontmatter = attributes

    return body
  })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
