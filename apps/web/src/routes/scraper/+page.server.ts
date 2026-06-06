import { readScraperStatus } from '$lib/server/scraper-status'

import type { PageServerLoad } from './$types.js'

export const load: PageServerLoad = async () => {
  return {
    scraperStatus: await readScraperStatus(),
  }
}
