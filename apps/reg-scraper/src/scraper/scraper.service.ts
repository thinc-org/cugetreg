import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'

import { OverrideService } from '@reg-scraper/override/override.service'
import { QueueStoreService } from '@reg-scraper/stores/queue-store/queue-store.service'

import { Semester, StudyProgram } from '@cgr/schema'

import { QueueProducerService } from './queue-producer/queue-producer.service'

@Injectable()
export class ScraperService {
  private logger: Logger = new Logger('ScraperService')

  private isScraping = false

  constructor(
    private readonly queueProducerService: QueueProducerService,
    private readonly queueStoreService: QueueStoreService,
    private readonly overrideService: OverrideService,
    private readonly configService: ConfigService
  ) {}

  getIsScraping() {
    return this.isScraping
  }

  @Cron('0 0 3 * * *', {
    timeZone: 'Asia/Bangkok',
  })
  async scrape() {
    const start = new Date()
    if (this.isScraping) {
      this.logger.error(
        'Received attempt to scrape via scheduler while already in progress. Exiting...'
      )
      process.exit(1)
    }
    this.isScraping = true

    const maxRequestsPerJob = this.queueStoreService.maxRequestsPerJob
    const cycleDurationMs = this.configService.get<number>('rateLimit.cycleDurationMs')
    this.logger.log(
      `[Starting] Starting scrape, ${maxRequestsPerJob} courses every ${cycleDurationMs} ms`
    )

    await Promise.all([
      this.queueProducerService.removeOldQueueData(),
      this.overrideService.reset(),
      this.queueStoreService.reset(),
    ])

    const academicYears = this.configService.get<string[]>('scraper.academicYears')
    const studyPrograms = this.configService.get<StudyProgram[]>('scraper.studyPrograms')
    const semesters = this.configService.get<Semester[]>('scraper.semesters')
    this.logger.log(
      `[Starting] Academic years: [${academicYears}], studyPrograms: [${studyPrograms}], semesters: [${semesters}]`
    )

    for (const academicYear of academicYears) {
      for (const studyProgram of studyPrograms) {
        for (const semester of semesters) {
          await this.queueProducerService.scrape(studyProgram, academicYear, semester)
        }
      }
    }
    const stop = new Date()
    this.isScraping = false
    this.logger.log(
      `[Complete] Saving all courses completed. Total: ${this.queueStoreService.length} courses`
    )
    this.logger.log(
      `Job started at ${start.toLocaleTimeString('th-TH')} and ended at ${stop.toLocaleTimeString('th-TH')}`
    )
    this.logger.log(`Time taken: ${(stop.getTime() - start.getTime()) / 1000} seconds`)
    this.logger.log(`----------------------------------------------------------------`)
  }
}
