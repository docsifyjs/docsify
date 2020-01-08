const copyDir = require('copy-dir')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

module.exports = async () => {
  const PORT = process.env.PORT || 3000
  global.__LIVESERVER__ = null
  global.PORT = PORT

  /**
   * IN this test suite, we are going to test our docs site with all the css,js linked to our local build packages
   *
   *  1.1 Copy ../docs --> ./fixtures/docs
   *  1.2 copy lib,themes --> ./fixtures/
   *  2. change the content of fixtures/docs/index.html to use all the links from our local build
   *  3. now jest runner will run to test all the *.spec.js files
   *
   */

  const shippedDirs = ['lib', 'themes']

  // 1
  const docsPath = path.join(process.cwd(), './docs')
  const fixtureDocsPath = path.join(__dirname, './fixtures/docs')

  // 1.1
  console.log('[e2e test docs] Copying the docs --> e2e/fixtures/docs')
  copyDir.sync(docsPath, fixtureDocsPath)

  // 1.2
  shippedDirs.forEach(dir => {
    const fromPath = path.join(process.cwd(), dir)
    const toPath = path.join(__dirname, `./fixtures/docs/${dir}`)
    console.log(`[e2e test docs] Copying  ${dir} --> e2e/fixtures/docs/${dir}`)
    copyDir.sync(fromPath, toPath)
  })

  // 2
  console.log(
    '[e2e test docs] Replacing content the tpl/index.html --> e2e/fixtures/docs/index.html'
  )
  const indexHTMLtplPath = path.join(
    __dirname,
    './fixtures/tpl/docs.index.html'
  )
  const fixtureIndexPath = path.join(__dirname, './fixtures/docs/index.html')
  const data = fs.readFileSync(indexHTMLtplPath, 'utf8')

  // 3
  const fixturePath = path.join(__dirname, './fixtures/docs')

  fs.writeFileSync(fixtureIndexPath, data, 'utf8')
  const child = spawn('node', [
    path.join(__dirname, './live.server.js'),
    PORT,
    fixturePath
  ])
  child.on('exit', code => {
    console.log(`Child process exited with code ${code}`)
  })
  child.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })
  child.stderr.on('data', data => {
    console.log(`stderr: ${data}`)
  })

  // LiveServer.start(params)
  global.__LIVESERVER__ = child
}
