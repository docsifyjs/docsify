import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
var browser
var page

jest.setTimeout(3000)
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
//   SetTimeout(() => {
//     browser.close()
//   }, 3000)
//   SetTimeout(() => process.exit(0), 5000)
})

test('should search "awesome docsify"  ', async done => {
  await page.waitForSelector(
    'body > main > aside > div.search > div.input-wrap > input[type=search]'
  )
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight)
  })
  page.tap(
    'body > main > aside > div.search > div.input-wrap > input[type=search]'
  )
  await page.keyboard.type(' awesome docsify', { delay: 100 })
  //   Await page.waitFor(3000)
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

test('should click on the first link and it should be "awesome" page link', async done => {
  await page.waitForSelector(
    'body > main > aside > div.search > div.results-panel.show > div:nth-child(1) > a'
  )
  await page.click('body > main > aside > div.search > div.results-panel.show > div:nth-child(1) > a')

  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

test('should search "Markdown configuration"', async done => {
  await page.goto('http://127.0.0.1:3000')
  await page.evaluate(_ => {
    window.scrollBy(0, window.innerHeight)
  })
  page.tap(
    'body > main > aside > div.search > div.input-wrap > input[type=search]'
  )
  await page.keyboard.type(' Markdown configuration', { delay: 100 })

  const ss = await page.screenshot()
  expectThres(ss)
  done()
})

test(' it should be "markdown configuration" page link', async done => {
  await page.click(
    'body > main > aside > div.search > div.results-panel.show > div:nth-child(1) > a'
  )
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})
