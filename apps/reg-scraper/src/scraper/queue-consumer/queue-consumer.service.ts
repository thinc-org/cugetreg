import { InjectQueue, Process, Processor } from '@nestjs/bull'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'

import type { Job, Queue } from 'bull'
import { Model } from 'mongoose'
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch'

import { OverrideService } from '@reg-scraper/override/override.service'
import { courseRequest } from '@reg-scraper/scraper/request/course.request'
import CourseFetchJob from '@reg-scraper/scraper/types/CourseFetchJob'
import { QueueStoreService } from '@reg-scraper/stores/queue-store/queue-store.service'

import { Course, GenEdType, Semester, StudyProgram } from '@cgr/schema'

interface CourseDoc {
  rawData: Course
  abbrName: string
  courseNo: string
  courseNameEn: string
  courseDescEn: string
  courseNameTh: string
  courseDescTh: string
  genEdType: GenEdType
  studyProgram: StudyProgram
  semester: Semester
  academicYear: string
}

@Processor({
  name: 'fetch',
})
export class QueueConsumerService {
  private logger: Logger = new Logger('QueueConsumer')

  constructor(
    private overrideService: OverrideService,
    @InjectModel('course') private courseModel: Model<Course>,
    @InjectQueue('fetch')
    private fetchQueue: Queue<CourseFetchJob>,
    private queueStoreService: QueueStoreService,
    @InjectOpensearchClient('default') private opensearchClient: OpensearchClient,
    private configService: ConfigService
  ) {}

  async saveCourse(course: Course): Promise<Course> {
    try {
      // Validate course data before saving
      this.validateCourseData(course)

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
          new: true,
        }
      )

      const res = await this.opensearchClient.update({
        id: result._id.toString(),
        index: this.configService.get<string>('courseIndexName'),
        body: {
          doc: {
            rawData: course,
            abbrName: course.abbrName,
            academicYear: course.academicYear,
            courseDescEn: course.courseDescEn,
            courseDescTh: course.courseDescTh,
            courseNameEn: course.courseNameEn,
            courseNameTh: course.courseNameTh,
            courseNo: course.courseNo,
            genEdType: course.genEdType,
            semester: course.semester,
            studyProgram: course.studyProgram,
          } as CourseDoc,
          doc_as_upsert: true,
        },
        refresh: true,
      })

      if (res.statusCode >= 400) {
        this.logger.error(res)
        throw new InternalServerErrorException('cannot insert data to opensearch database')
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Error saving course ${course.courseNo}: ${errorMessage}`)
      // Re-throw to let the caller handle it
      throw error
    }
  }

  private validateCourseData(course: Course): void {
    const validDaysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'IA', 'AR']

    if (!course.sections || !Array.isArray(course.sections)) {
      throw new Error(`Invalid sections data for course ${course.courseNo}`)
    }

    for (const section of course.sections) {
      if (!section.classes || !Array.isArray(section.classes)) {
        continue
      }

      for (const classItem of section.classes) {
        if (classItem.dayOfWeek && !validDaysOfWeek.includes(classItem.dayOfWeek)) {
          this.logger.error(
            `Invalid dayOfWeek '${classItem.dayOfWeek}' found in course ${course.courseNo}, section ${section.sectionNo}`
          )
          throw new Error(
            `Invalid dayOfWeek '${classItem.dayOfWeek}' for course ${course.courseNo}. Expected one of: ${validDaysOfWeek.join(', ')}`
          )
        }
      }
    }
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
      const mongoosePromises: Promise<Course>[] = []
      for (const course of courses) {
        mongoosePromises.push(this.saveCourse(course))
      }
      const results = await Promise.allSettled(mongoosePromises)
      for (const index in results) {
        if (results[index].status == 'rejected') {
          const result = results[index] as PromiseRejectedResult
          this.logger.error(
            `[Error] On ${studyProgram}-${semester}/${academicYear}: Saving Courses ${courses[index].courseNo} failed: ${result.reason}`,
            result.reason.stack
          )
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (tryCount >= 1) {
          this.logger.error(
            `[Error] On ${studyProgram}-${semester}/${academicYear}: Retrieving Courses failed: ${error.message}, will discard this job.`
          )
          return
        }
        this.logger.error(
          `[Error] Retrieving Courses failed: ${error.message as string}, requeueing`
        )
        this.fetchQueue.add({ ...job.data, tryCount: job.data.tryCount + 1 })
        this.queueStoreService.length += job.data.courses.length
      }
    } finally {
      this.queueStoreService.increment(job.data.courses.length)
    }
  }
}
