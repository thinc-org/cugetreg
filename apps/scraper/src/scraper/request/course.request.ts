import { Logger } from '@nestjs/common'

import { Course, Semester } from '@thinc-org/chula-courses'

import { instance } from '@scraper/scraper/instance'
import { courseParam } from '@scraper/scraper/params/course.param'
import { courseSelector } from '@scraper/scraper/selector/course.selector'

const path = '/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseScheduleDtlNewServlet'
const logger = new Logger('CourseRequest')
const MAX_TRY = 10

export async function courseRequest(
  courseNo: string,
  studyProgram: string,
  academicYear: string,
  semester: string
): Promise<Course> {
  for (let i = 0; i < MAX_TRY; i++) {
    try {
      //send request of course
      logger.debug(
        `[Running] On ${studyProgram}-${semester}/${academicYear}: Scraping on Course No. ${courseNo}`
      )
      const response = await instance.get<string>(path, {
        params: courseParam(courseNo, studyProgram),
        timeout: 2000,
      })

      logger.debug(
        `[Running] On ${studyProgram}-${semester}/${academicYear}: Fetched Course No. ${courseNo}`
      )
      if (!response.data) {
        throw new Error('empty response data')
      }
      logger.debug(
        `[Running] On ${studyProgram}-${semester}/${academicYear}: Selecting Course No. ${courseNo}`
      )

      const course = await courseSelector(response.data, academicYear, semester as Semester)
      logger.debug(
        `[Running] On ${studyProgram}-${semester}/${academicYear}: Selected Course No. ${courseNo}`
      )
      return course
    } catch (err) {
      logger.error(
        `[Error] On ${studyProgram}-${semester}/${academicYear}: Can't fetch Course No. ${courseNo}: ${err}, retry = ${i + 1}`
      )
    }
  }
  throw new Error('Retry count exceed')
}
