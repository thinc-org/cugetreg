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
    const query = await this.createQuery(
      { keyword, genEdTypes, dayOfWeeks, periodRange },
      { semester, academicYear, studyProgram }
    )
    const courses = await this.courseModel.find(query).limit(limit).skip(offset).lean()
    return courses
  }

  async createQuery(
    filter: FilterInput,
    courseInput: CourseGroupInput
  ): Promise<FilterQuery<CourseDocument>> {
    const query = {
      semester: courseInput.semester,
      academicYear: courseInput.academicYear,
      studyProgram: courseInput.studyProgram,
    } as FilterQuery<CourseDocument>

    const escapedKeyword = escapeRegExpString(filter.keyword.trim())
    if (filter.keyword) {
      query.$or = [
        { courseNo: new RegExp('^' + escapedKeyword, 'i') },
        { abbrName: new RegExp(escapedKeyword, 'i') },
        { courseNameTh: new RegExp(escapedKeyword, 'i') },
        { courseNameEn: new RegExp(escapedKeyword, 'i') },
      ]
    }

    if (filter.genEdTypes.length > 0) {
      query.genEdType = { $in: filter.genEdTypes }
    }

    if (filter.dayOfWeeks.length > 0) {
      query['sections.classes.dayOfWeek'] = { $in: filter.dayOfWeeks }
    }

    if (filter.periodRange) {
      const { start, end } = filter.periodRange
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

    return query
  }
}

function isTime(timeString: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/
  return timeRegex.test(timeString)
}
