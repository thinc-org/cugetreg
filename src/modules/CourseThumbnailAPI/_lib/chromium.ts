import core from 'puppeteer-core'

import { getOptions } from './options'
import { FileType } from './types'

let _page: core.Page | null

const browserWSEndpoint = process.env.BROWSERLESS_URL

async function getPage(isDev: boolean) {
  if (_page) {
    return _page
  }
  let browser: core.Browser
  if (typeof browserWSEndpoint !== 'undefined') {
    browser = await core.connect({ browserWSEndpoint })
  } else {
    const options = await getOptions(isDev)
    browser = await core.launch(options)
  }
  browser.on('disconnected', () => (_page = null))
  _page = await browser.newPage()
  return _page
}

export async function getScreenshot(html: string, type: FileType, isDev: boolean) {
  const page = await getPage(isDev)
  await page.setViewport({ width: 1200, height: 630 })
  await page.setContent(html)
  const file = await page.screenshot({ type })
  return file
}
