import parser from './parser'

const install = function (hook, vm) {
  hook.beforeEach(content => {
    const { attributes, body } = parser(content)

    Docsify.util.merge(vm.config, attributes.config)

    return body
  })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
