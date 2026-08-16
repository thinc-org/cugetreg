import { readScraperStatus } from '$lib/server/scraper-status';

import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const status = await readScraperStatus();
  return json(status);
};
