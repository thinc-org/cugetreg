import { Args, Query, Resolver } from '@nestjs/graphql'

import { Semester, StudyProgram } from '@cgr/schema'

import { CourseGroupInput, FilterInput, Course as GraphQLCourse } from '../graphql'
import { CourseService } from './course.service'
import { ICourseSearchDocument, ICourseSearchFilter } from './interface/course.interface'
import { isTime } from '@api/util/functions'
import { BadRequestException } from '@nestjs/common'
import { SearchService } from '@api/search/search.service'
import { ConfigService } from '@nestjs/config'
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'

@Resolver('Course')
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly configService: ConfigService,
    private readonly searchService: SearchService
  ) {}

  @Query('courseNos')
  courseNos(): Promise<Record<StudyProgram, string[]>> {
    return this.courseService.getAllCourseNos()
  }

  @Query('course')
  findOne(
    @Args('courseNo') courseNo: string,
    @Args('courseGroup')
    { semester, academicYear, studyProgram }: CourseGroupInput
  ): Promise<GraphQLCourse> {
    return this.courseService.findOne(
      courseNo,
      semester as Semester,
      academicYear,
      studyProgram as StudyProgram
    )
  }

  @Query('search')
  async search(
    @Args('filter') filter: FilterInput,
    @Args('courseGroup') courseGroup: CourseGroupInput
  ): Promise<ICourseSearchDocument[]> {
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
    }

    return this.searchService.search<ICourseSearchDocument>({
      index: this.configService.get<string>('courseIndex'),
      query: buildCourseQuery({
        keyword: filter.keyword,
        genEdTypes: filter.genEdTypes,
        dayOfWeeks: filter.dayOfWeeks,
        periodRange: filter.periodRange,
        studyProgram: courseGroup.studyProgram,
        semester: courseGroup.semester,
        academicYear: courseGroup.academicYear,
      }),
      from: filter.offset,
      size: filter.limit,
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
