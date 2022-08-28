import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Semester, StudyProgram } from '@thinc-org/chula-courses'
import { FilterQuery, Model } from 'mongoose'

import { escapeRegExpString } from '@api/util/functions'

import { Course } from '../common/types/course.type'
import { CourseGroupInput, FilterInput } from '../graphql'
import { CourseDocument } from '../schemas/course.schema'

@Injectable()
export class CourseService {
  constructor(@InjectModel('course') private courseModel: Model<CourseDocument>) {}

  async findOne(
    courseNo: string,
    semester: Semester,
    academicYear: string,
    studyProgram: StudyProgram
  ): Promise<Course> {
    const course = await this.courseModel
      .findOne({ courseNo, semester, academicYear, studyProgram })
      .lean()
    if (!course) {
      throw new NotFoundException({
        reason: 'COURSE_NOT_FOUND',
        message: "Can't find a course with the given properties",
      })
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

  async search(
    {
      keyword = '',
      genEdTypes = [],
      dayOfWeeks = [],
      limit = 10,
      offset = 0,
      periodRange,
    }: FilterInput,
    { semester, academicYear, studyProgram }: CourseGroupInput
  ): Promise<Course[]> {
    const query = {
      semester,
      academicYear,
      studyProgram,
    } as FilterQuery<CourseDocument>
    keyword = keyword.trim()
    if (keyword) {
      query.$or = [
        { courseNo: new RegExp('^' + escapeRegExpString(keyword), 'i') },
        { abbrName: new RegExp(escapeRegExpString(keyword), 'i') },
        { courseNameTh: new RegExp(escapeRegExpString(keyword), 'i') },
        { courseNameEn: new RegExp(escapeRegExpString(keyword), 'i') },
      ]
    }

    if (genEdTypes.length > 0) {
      query.genEdType = { $in: genEdTypes }
    }

    if (dayOfWeeks.length > 0) {
      query['sections.classes.dayOfWeek'] = { $in: dayOfWeeks }
    }

    if (periodRange) {
      const { start, end } = periodRange
      if (!isTime(start) || !isTime(end)) {
        throw new BadRequestException({
          reason: 'INVALID_PERIOD_RANGE',
          message: 'Start time or end time is invalid',
        })
      }
      if (start > end) {
        throw new BadRequestException({
          reason: 'INVALID_PERIOD_RANGE',
          message: 'Start time cannot be later than end time',
        })
      }
      query['sections.classes'] = {
        $elemMatch: {
          'period.start': { $gte: start },
          'period.end': { $lte: end },
        },
      }
    }

    const courses = await this.courseModel.find(query).limit(limit).skip(offset).lean()
    return courses
  }
}

function isTime(timeString: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/
  return timeRegex.test(timeString)
}
