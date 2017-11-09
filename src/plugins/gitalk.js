function install (hook, vm) {
  const dom = Docsify.dom

  hook.mounted(_ => {
    const div = dom.create('div')
    div.id = 'gitalk-container'
    const main = dom.getNode('#main')
    div.style = `width: ${main.clientWidth}px; margin: 0 auto 20px;`
    dom.appendTo(dom.find('.content'), div)
    const script = dom.create('script')
    const content = `gitalk.render('gitalk-container')`
    script.textContent = content
    dom.appendTo(dom.body, script)
  })
}

$docsify.plugins = [].concat(install, $docsify.plugins)
