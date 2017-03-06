const scriptReg = /<script[^>]*src=["|'](.*)["|']>[^\w]*<\/script>/
const asyncReg = /<script[^>]*\s+async/
const deferReg = /<script[^>]*\s+defer/

function handleExternalScript (html) {
  const scriptMatch = html.match(scriptReg)

  if (scriptMatch && scriptMatch.length > 1) {
    const script = document.createElement('script')
    script.src = scriptMatch[1]

    if (asyncReg.test(scriptMatch[0])) script.setAttribute('async', '')
    if (deferReg.test(scriptMatch[0])) script.setAttribute('defer', '')

    const target = document.querySelector('#main')
    target.appendChild(script)
  }
}

const install = function (hook) {
  hook.afterEach(handleExternalScript)
}

window.$docsify.plugins = [].concat(install, window.$docsify.plugins)
