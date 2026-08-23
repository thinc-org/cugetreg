import fs from 'node:fs/promises';
import path from 'node:path';

import { env } from '$env/dynamic/private';

export type ScraperStatusResponse = {
  status: 'idle' | 'running' | 'completed' | 'failed';
  started_at?: string | null;
  finished_at?: string | null;
  courses_total?: number;
  courses_scraped?: number;
  courses_failed?: number;
  message?: string;
};

const defaultStatus: ScraperStatusResponse = {
  status: 'idle',
  message: 'No scrape has been run yet.',
};

export async function readScraperStatus(): Promise<ScraperStatusResponse> {
  const configured = env.SCRAPER_STATUS_PATH;
  const statusPath = configured
    ? path.resolve(configured)
    : path.resolve(process.cwd(), '../reg-scraper-py/data/scraper-status.json');

  try {
    const raw = await fs.readFile(statusPath, 'utf-8');
    return JSON.parse(raw) as ScraperStatusResponse;
  } catch {
    return defaultStatus;
  }
}
