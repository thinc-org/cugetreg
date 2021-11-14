import core from 'puppeteer-core'

import { browserlessUrl } from '@/utils/env'

import { getOptions } from './options'
import { FileType } from './types'

let _page: core.Page | null

async function getPage(isDev: boolean) {
  if (_page) {
    return _page
  }
  let browser: core.Browser
  if (browserlessUrl !== null) {
    browser = await core.connect({ browserWSEndpoint: browserlessUrl })
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
  await page.setContent(html, { waitUntil: 'networkidle0' })
  const file = await page.screenshot({ type })
  return file as Buffer
}
