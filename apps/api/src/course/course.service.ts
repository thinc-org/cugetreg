import { UserInputError } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { DayOfWeek, GenEdType, Semester, StudyProgram } from '@thinc-org/chula-courses'
import { Model } from 'mongoose'

import { Course } from '../common/types/course.type'
import { CourseDocument } from '../schemas/course.schema'
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'
import { Period } from '@api/graphql'
import { SearchService } from '@api/search/search.service'
import { ConfigService } from '@nestjs/config'
import { isTime } from '@api/util/functions'
import { ICourseSearchDocument, ICourseSearchFilter } from './interface/course.interface'

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('course') private courseModel: Model<CourseDocument>,
    private readonly configService: ConfigService,
    private readonly searchService: SearchService
  ) {}

  async findOne(
    courseNo: string,
    semester: Semester,
    academicYear: string,
    studyProgram: StudyProgram
  ): Promise<CourseDocument> {
    const course = await this.courseModel.findOne({
      courseNo,
      semester,
      academicYear,
      studyProgram,
    })

    if (!course) {
      throw new NotFoundError("Can't find a course with the given parameters")
    }
    return course
  }

  async getAllCourseNos(): Promise<Record<StudyProgram, string[]>> {
    const courses = await this.courseModel.aggregate([
      {
        $group: {
          _id: { courseNo: '$courseNo', studyProgram: '$studyProgram' },
        },
      },
    ])
    const courseNos: Record<StudyProgram, string[]> = {
      S: [],
      T: [],
      I: [],
    }
    for (const course of courses) {
      courseNos[course._id.studyProgram].push(course._id.courseNo)
    }
    return courseNos
  }
}
