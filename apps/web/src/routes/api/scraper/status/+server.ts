import { json } from '@sveltejs/kit'

import { readScraperStatus } from '$lib/server/scraper-status'

import type { RequestHandler } from './$types.js'

export const GET: RequestHandler = async () => {
  const status = await readScraperStatus()
  return json(status)
}
