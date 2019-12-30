import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
var browser
var page

jest.setTimeout(300000)
expect.extend({ toMatchImageSnapshot })

const expectThres = ss => {
  expect(ss).toMatchImageSnapshot({
    failureThreshold: 10,
    failureThresholdType: 'percent'
  })
}

beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.goto('http://127.0.0.1:3000')
})

afterAll(async () => {
  await browser.close()
  // SetTimeout(() => process.exit(0), 5000)
})

test('should take snapshots of home page (cover) ', async done => {
  expect(Object.keys(page).length).toBeGreaterThan(0)
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

test('should scroll down to readme', async done => {
  expect(Object.keys(page).length).toBeGreaterThan(0)

  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight)
  })
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

// Quickstart Page tests

test('go to #quickstart', async done => {
  await page.click('a[href=\'#/quickstart\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const quickStartIds = [
  'initialize',
  'writing-content',
  'preview-your-site',
  'manual-initialization',
  'loading-dialog'
]
quickStartIds.forEach(id => {
  test('go to #quickstart?id=' + id, async done => {
    await page.click(`a.section-link[href='#/quickstart?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// More pages id tests

test('go to #more-pages', async done => {
  await page.click('a[href=\'#/more-pages\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const morePagesIds = [
  'sidebar',
  'nested-sidebars',
  'set-page-titles-from-sidebar-selection',
  'table-of-contents',
  'ignoring-subheaders'
]
morePagesIds.forEach(id => {
  test('go to #quickstart?id=' + id, async done => {
    await page.click(`a.section-link[href='#/more-pages?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Custom-navbar id tests

test('go to #custom-navbar', async done => {
  await page.click('a[href=\'#/custom-navbar\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const customNavbarIds = [
  'html',
  'markdown',
  'nesting',
  'combining-custom-navbars-with-the-emoji-plugin'
]
customNavbarIds.forEach(id => {
  test('go to #custom-navbar?id=' + id, async done => {
    await page.click(`a.section-link[href='#/custom-navbar?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Cover id tests

test('go to #cover', async done => {
  await page.click('a[href=\'#/cover\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const coverIds = [
  'basic-usage',
  'custom-background',
  'coverpage-as-homepage',
  'multiple-covers'
]
coverIds.forEach(id => {
  test('go to #cover?id=' + id, async done => {
    await page.click(`a.section-link[href='#/cover?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Themes id tests

test('go to #themes', async done => {
  await page.click('a[href=\'#/themes\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const themesIds = ['other-themes']
themesIds.forEach(id => {
  test('go to #themes?id=' + id, async done => {
    await page.click(`a.section-link[href='#/themes?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Plugins id tests

test('go to #plugins', async done => {
  await page.click('a[href=\'#/plugins\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const pluginsIds = [
  'full-text-search',
  'google-analytics',
  'emoji',
  'external-script',
  'zoom-image',
  'edit-on-github',
  'demo-code-with-instant-preview-and-jsfiddle-integration',
  'copy-to-clipboard',
  'disqus',
  'gitalk',
  'pagination',
  'codefund',
  'tabs',
  'more-plugins'
]
pluginsIds.forEach(id => {
  test('go to #plugins?id=' + id, async done => {
    await page.click(`a.section-link[href='#/plugins?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Write-a-plugin id tests

test('go to #write-a-plugin', async done => {
  await page.click('a[href=\'#/write-a-plugin\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const writeAPluginIds = ['full-configuration', 'example', 'tips']
writeAPluginIds.forEach(id => {
  test('go to #write-a-plugin?id=' + id, async done => {
    await page.click(`a.section-link[href='#/write-a-plugin?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Markdown id tests

test('go to #markdown', async done => {
  await page.click('a[href=\'#/markdown\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const markdownIds = ['supports-mermaid']
markdownIds.forEach(id => {
  test('go to #markdown?id=' + id, async done => {
    await page.click(`a.section-link[href='#/markdown?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Language-highlight id tests

test('go to #language-highlight', async done => {
  await page.click('a[href=\'#/language-highlight\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

// Deploy id tests

test('go to #deploy', async done => {
  await page.click('a[href=\'#/deploy\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const deployIds = [
  'github-pages',
  'gitlab-pages',
  'firebase-hosting',
  'vps',
  'netlify',
  'zeit-now',
  'aws-amplify'
]
deployIds.forEach(id => {
  test('go to #deploy?id=' + id, async done => {
    await page.click(`a.section-link[href='#/deploy?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Helpers id tests

test('go to #helpers', async done => {
  await page.click('a[href=\'#/helpers\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const helpersIds = [
  'important-content',
  'general-tips',
  'ignore-to-compile-link',
  'set-target-attribute-for-link',
  'disable-link',
  'github-task-lists',
  'image-resizing',
  'customise-id-for-headings',
  'markdown-in-html-tag'
]
helpersIds.forEach(id => {
  test('go to #helpers?id=' + id, async done => {
    await page.click(`a.section-link[href='#/helpers?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Vue id tests

test('go to #vue', async done => {
  await page.click('a[href=\'#/vue\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const vueIds = ['basic-usage', 'combine-vuep-to-write-playground']
vueIds.forEach(id => {
  test('go to #vue?id=' + id, async done => {
    await page.click(`a.section-link[href='#/vue?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Cdn id tests

test('go to #cdn', async done => {
  await page.click('a[href=\'#/cdn\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const cdnIds = [
  'latest-version',
  'specific-version',
  'compressed-file',
  'other-cdn'
]
cdnIds.forEach(id => {
  test('go to #cdn?id=' + id, async done => {
    await page.click(`a.section-link[href='#/cdn?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Pwa id tests

test('go to #pwa', async done => {
  await page.click('a[href=\'#/pwa\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const pwaIds = ['create-serviceworker', 'register', 'enjoy-it']
pwaIds.forEach(id => {
  test('go to #pwa?id=' + id, async done => {
    await page.click(`a.section-link[href='#/pwa?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Ssr id tests

test('go to #ssr', async done => {
  await page.click('a[href=\'#/ssr\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const ssrIds = [
  'why-ssr',
  'quick-start',
  'custom-template',
  'configuration',
  'deploy-for-your-vps'
]
ssrIds.forEach(id => {
  test('go to #ssr?id=' + id, async done => {
    await page.click(`a.section-link[href='#/ssr?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Embed-files id tests

test('go to #embed-files', async done => {
  await page.click('a[href=\'#/embed-files\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const embedFilesIds = [
  'embedded-file-type',
  'embedded-code-fragments',
  'tag-attribute',
  'the-code-block-highlight'
]
embedFilesIds.forEach(id => {
  test('go to #embed-files?id=' + id, async done => {
    await page.click(`a.section-link[href='#/embed-files?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// Configuration id tests

test('go to #configuration', async done => {
  await page.click('a[href=\'#/configuration\']')
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

const configurationIds = [
  'el',
  'repo',
  'maxlevel',
  'loadnavbar',
  'loadsidebar',
  'submaxlevel',
  'auto2top',
  'homepage',
  'basepath',
  'relativepath',
  'coverpage',
  'logo',
  'name',
  'namelink',
  'markdown',
  'themecolor',
  'alias',
  'autoheader',
  'executescript',
  'noemoji',
  'mergenavbar',
  'formatupdated',
  'externallinktarget',
  'cornerexternallinktarget',
  'externallinkrel',
  'routermode',
  'nocompilelinks',
  'onlycover',
  'requestheaders',
  'ext',
  'fallbacklanguages',
  'notfoundpage'
]
configurationIds.forEach(id => {
  test('go to #configuration?id=' + id, async done => {
    await page.click(`a.section-link[href='#/configuration?id=${id}']`)
    const ss = await page.screenshot()
    expectThres(ss)
    done()
  })
})

// // SIDEBARs

// const sideBarIds = [
//   '#/quickstart',
//   '#/more-pages',
//   '#/custom-navbar',
//   '#/cover',
//   '#/configuration',
//   '#/themes',
//   '#/plugins',
//   '#/write-a-plugin',
//   '#/markdown',
//   '#/language-highlight',
//   '#/deploy',
//   '#/helpers',
//   '#/vue',
//   '#/cdn',
//   '#/pwa',
//   '#/ssr',
//   '#/embed-files'
// ]
