import { InjectQueue, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Course } from '@thinc-org/chula-courses'
import { Job, Queue } from 'bull'
import { Model } from 'mongoose'

import { OverrideService } from '@reg-scraper/override/override.service'
import { CourseDocument } from '@reg-scraper/schema/course.schema'
import { courseRequest } from '@reg-scraper/scraper/request/course.request'
import CourseFetchJob from '@reg-scraper/scraper/types/CourseFetchJob'
import { QueueStoreService } from '@reg-scraper/stores/queue-store/queue-store.service'

@Processor({
  name: 'fetch',
})
export class QueueConsumerService {
  private logger: Logger = new Logger('QueueConsumer')

  constructor(
    private overrideService: OverrideService,
    @InjectModel('course') private courseModel: Model<CourseDocument>,
    @InjectQueue('fetch')
    private fetchQueue: Queue<CourseFetchJob>,
    private queueStoreService: QueueStoreService
  ) {}

  async saveCourse(course: Course): Promise<CourseDocument> {
    const result = await this.courseModel.findOneAndUpdate(
      {
        courseNo: course.courseNo,
        semester: course.semester,
        studyProgram: course.studyProgram,
        academicYear: course.academicYear,
      },
      course,
      {
        upsert: true,
        overwrite: true,
      }
    )

    return result
  }

  @Process()
  async jobHandler(job: Job<CourseFetchJob>) {
    const courses: Course[] = []
    const promises: Promise<Course>[] = []
    const { studyProgram, academicYear, semester, tryCount } = job.data

    try {
      for (const course of job.data.courses) {
        const promise = courseRequest(course, studyProgram, academicYear, semester)
        promises.push(promise)
      }
      const rawCourses = await Promise.all(promises)
      for (const rawCourse of rawCourses) {
        const course = this.overrideService.applyOverrides(rawCourse)
        courses.push(course)
      }
      // save course data to mongo
      const mongoosePromises: Promise<CourseDocument>[] = []
      for (const course of courses) {
        mongoosePromises.push(this.saveCourse(course))
      }
      const results = await Promise.allSettled(mongoosePromises)
      for (const index in results) {
        if (results[index].status == 'rejected') {
          const result = results[index] as PromiseRejectedResult
          this.logger.error(
            `[Error] On ${studyProgram}-${semester}/${academicYear}: Saving Courses ${courses[index].courseNo} failed: ${result.reason}`
          )
        }
      }
    } catch (error) {
      if (tryCount >= 1) {
        this.logger.error(
          `[Error] On ${studyProgram}-${semester}/${academicYear}: Retrieving Courses failed: ${error.message}, will discard this job.`
        )
        return
      }
      this.logger.error(`[Error] Retrieving Courses failed: ${error.message}, requeueing`)
      this.fetchQueue.add({ ...job.data, tryCount: job.data.tryCount + 1 })
      this.queueStoreService.length += job.data.courses.length
    } finally {
      this.queueStoreService.increment(job.data.courses.length)
    }
  }
}
