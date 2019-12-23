import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
var browser
var page

jest.setTimeout(30000)
expect.extend({ toMatchImageSnapshot })
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.goto('https://www.google.com')
})

afterAll(async () => {
  await browser.close()
  // SetTimeout(() => process.exit(0), 5000)
})

test('should take snapshots of home page (cover) ', async done => {
  expect(Object.keys(page).length).toBeGreaterThan(0)

  await page.goto('http://127.0.0.1:3000')
  const ss = await page.screenshot()

  expect(ss).toMatchImageSnapshot({
    failureThreshold: 10,
    failureThresholdType: 'percent'
  })
  done()
})
