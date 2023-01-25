import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'

import { Queue } from 'bull'

import { searchRequest } from '@reg-scraper/scraper/request/search.request'
import CourseFetchJob from '@reg-scraper/scraper/types/CourseFetchJob'
import { QueueStoreService } from '@reg-scraper/stores/queue-store/queue-store.service'

const logger: Logger = new Logger('QueueProducer')

function groupBy<T>(array: T[], count: number): T[][] {
  const result = []
  for (let i = 0; i < array.length; i = i + count) {
    result.push(array.slice(i, i + count))
  }

  return result
}
const MAX_TRY = 5

@Injectable()
export class QueueProducerService {
  constructor(
    @InjectQueue('fetch')
    private fetchQueue: Queue<CourseFetchJob>,
    private queueStoreService: QueueStoreService
  ) {}

  async removeOldQueueData() {
    await this.fetchQueue.obliterate({ force: true })
  }

  async scrape(studyProgram: string, academicYear: string, semester: string) {
    await this.fetchQueue.pause()

    for (let round = 0; round < MAX_TRY; round++) {
      try {
        logger.log(
          `[Starting With Producer] On ${studyProgram}-${semester}/${academicYear} Round ${round}: Scraping Course Nos...`
        )
        const res = (await searchRequest(studyProgram, semester, academicYear)).filter(
          (course) => course !== ''
        )
        groupBy(res, this.queueStoreService.maxRequestsPerJob)
          .map<CourseFetchJob>((courses) => {
            return {
              courses,
              studyProgram,
              academicYear,
              semester,
              tryCount: 0,
            }
          })
          .forEach((courses) => {
            this.fetchQueue.add(courses)
          })

        this.queueStoreService.length += res.length

        break
      } catch (err) {
        logger.error(
          `[Error] On ${studyProgram}-${semester}/${academicYear}: Can't fetch courses: ${err}, retry = ${round}`
        )
        if (round == MAX_TRY - 1) {
          logger.error(
            `[Error] On ${studyProgram}-${semester}/${academicYear}: Can't fetch courses and already exceed max try, skipping...`
          )
          return
        }
      } finally {
        // Critical for blocking scrapper service to wait all jobs to be done
        await this.fetchQueue.resume()
        await this.queueStoreService.onRoundFinished(async () => {
          this.fetchQueue.clean(0)
        })
      }
    }
  }
}
