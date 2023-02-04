import { ConflictException, Controller, Logger, Post } from '@nestjs/common'

import { QueueStoreService } from '@reg-scraper/stores/queue-store/queue-store.service'

import { ScraperService } from './scraper.service'

@Controller('scraper')
export class ScraperController {
  private logger: Logger = new Logger('ScraperController')

  constructor(
    private readonly scraperService: ScraperService,
    private readonly queueStoreService: QueueStoreService
  ) {}

  @Post()
  postScrape() {
    if (this.scraperService.getIsScraping()) {
      this.logger.error(
        'Received attempt via controller to scrape while already in progress. Rejected.'
      )
      throw new ConflictException('Scraping already in progress. Rejected.')
    }
    this.scraperService.scrape()
  }
}
