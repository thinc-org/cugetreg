import { readScraperStatus } from '$lib/server/scraper-status';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    scraperStatus: await readScraperStatus(),
  };
};
