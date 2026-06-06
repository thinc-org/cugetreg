import fs from 'node:fs/promises'
import path from 'node:path'

import { env } from '$env/dynamic/private'

export type ScraperStatusResponse = {
  status: 'idle' | 'running' | 'completed' | 'failed'
  started_at?: string
  finished_at?: string
  courses_scraped?: number
  courses_failed?: number
  message?: string
}

const defaultStatus: ScraperStatusResponse = {
  status: 'idle',
  message: 'No scrape has been run yet.',
}

export async function readScraperStatus(): Promise<ScraperStatusResponse> {
  const configured = env.SCRAPER_STATUS_PATH
  const statusPath = configured
    ? path.resolve(configured)
    : path.resolve(process.cwd(), '../../packages/database/data/scraper-status.json')

  try {
    const raw = await fs.readFile(statusPath, 'utf-8')
    return JSON.parse(raw) as ScraperStatusResponse
  } catch {
    return defaultStatus
  }
}
