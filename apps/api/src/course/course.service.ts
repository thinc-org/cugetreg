import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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

  async search({
    keyword = '',
    genEdTypes = [],
    dayOfWeeks = [],
    limit = 10,
    offset = 0,
    periodRange = {
      start: '06:00',
      end: '20:00',
    },
    studyProgram,
    semester,
    academicYear,
  }): Promise<ICourseSearchDocument[]> {
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
    }
    return this.searchService.search<ICourseSearchDocument>({
      index: this.configService.get<string>('courseIndex'),
      query: buildCourseQuery({
        keyword,
        genEdTypes,
        dayOfWeeks,
        periodRange,
        studyProgram,
        semester,
        academicYear,
      }),
      from: offset,
      size: limit,
    })
  }
}

// build the query
function buildCourseQuery(filter: ICourseSearchFilter): QueryDslQueryContainer {
  // create the base query from values that guarantee is not undefined
  const boolMust: QueryDslQueryContainer[] = [
    {
      multi_match: {
        query: filter.keyword,
        fields: [
          'abbrName^5',
          'courseNo^5',
          'courseNameEn^3',
          'courseDescEn',
          'courseNameTh^3',
          'courseDescTh',
        ],
      },
    },
    {
      term: {
        semester: {
          value: filter.semester,
        },
      },
    },
    {
      term: {
        studyProgram: {
          value: filter.studyProgram,
        },
      },
    },
    {
      term: {
        academicYear: {
          value: filter.academicYear,
        },
      },
    },
  ]

  const nestedQuery: QueryDslQueryContainer[] = []

  // push the query for each filter if filter is not undefined
  if (filter.dayOfWeeks.length > 0) {
    nestedQuery.push({
      terms: {
        'rawData.sections.classes.dayOfWeek': filter.dayOfWeeks,
      },
    })
  }

  if (filter.periodRange) {
    nestedQuery.push({
      nested: {
        path: 'rawData.sections.classes.period',
        query: {
          query_string: {
            query: `rawData.sections.classes.period.start:[${filter.periodRange.start} TO ${filter.periodRange.end}] AND rawData.sections.classes.period.end:[* TO ${filter.periodRange.end}]`,
          },
        },
      },
    })
  }

  if (filter.genEdTypes.length > 0) {
    boolMust.push({
      terms: {
        genEdType: filter.genEdTypes,
      },
    })
  }

  if (nestedQuery.length > 0) {
    boolMust.push({
      nested: {
        path: 'rawData',
        query: {
          nested: {
            path: 'rawData.sections',
            query: {
              nested: {
                path: 'rawData.sections.classes',
                query: {
                  bool: {
                    must: nestedQuery,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  return {
    bool: {
      must: boolMust,
    },
  }
}
