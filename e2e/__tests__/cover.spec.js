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
  // SetTimeout(() => process.exit(0), 5000)
})

test('should click on the "get started button"', async done => {
  await page.waitForSelector(
    'body > section > div.cover-main > p:nth-child(5) > a:nth-child(2)'
  )
  await page.click(
    'body > section > div.cover-main > p:nth-child(5) > a:nth-child(2)'
  )
  const ss = await page.screenshot()
  expectThres(ss)
  done()
})
