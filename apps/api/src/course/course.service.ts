import { UserInputError } from '@nestjs/apollo'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { FilterQuery, Model } from 'mongoose'

import { NotFoundError } from '@api/common/errors'
import { escapeRegExpString } from '@api/util/functions'

import { Course, CourseDocument, Semester, StudyProgram } from '@cgr/schema'

import { CourseGroupInput, FilterInput } from '../graphql'

@Injectable()
export class CourseService {
  constructor(@InjectModel('course') private courseModel: Model<Course>) {}

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
  ): Promise<CourseDocument[]> {
    const query = {
      semester,
      academicYear,
      studyProgram,
    } as FilterQuery<Course>
    const escapedKeyword = escapeRegExpString(keyword.trim())
    if (keyword) {
      query.$or = [
        { courseNo: new RegExp('^' + escapedKeyword, 'i') },
        { abbrName: new RegExp(escapedKeyword, 'i') },
        { courseNameTh: new RegExp(escapedKeyword, 'i') },
        { courseNameEn: new RegExp(escapedKeyword, 'i') },
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
        throw new UserInputError('Start time or end time is invalid')
      }
      if (start > end) {
        throw new UserInputError('Start time cannot be later than end time')
      }
      query['sections.classes'] = {
        $elemMatch: {
          'period.start': { $gte: start },
          'period.end': { $lte: end },
        },
      }
    }

    const courses = await this.courseModel.find(query).limit(limit).skip(offset)
    return courses
  }
}

function isTime(timeString: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/
  return timeRegex.test(timeString)
}
