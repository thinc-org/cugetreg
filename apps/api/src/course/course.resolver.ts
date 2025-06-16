/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { buildCourseQuery } from '@api/search/queries/course'
import { SearchService } from '@api/search/search.service'
import { isTime } from '@api/util/functions'

import { Course, CourseDocument, DayOfWeek, GenEdType, Semester, StudyProgram } from '@cgr/schema'

import { CourseGroupInput, FilterInput, Period } from '../graphql'
import { CourseService } from './course.service'

export interface ICourseSearchDocument {
  abbrName: string
  courseNo: string
  courseNameTh: string
  courseNameEn: string
  courseDescTh: string
  courseDescEn: string
  genEdType: string
  studyProgram: string
  semester: string
  academicYear: string
  rawData: Course
}

export interface ICourseSearchFilter {
  keyword: string
  genEdTypes?: GenEdType[]
  dayOfWeeks?: DayOfWeek[]
  periodRange: Period
  studyProgram: string
  semester: string
  academicYear: string
}

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
  ): Promise<CourseDocument> {
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
    @Args('courseGroup') courseGroup: CourseGroupInput,
    @Args('useOpenSearch', { type: () => Boolean, nullable: true })
    useOpenSearch: boolean = false
  ): Promise<Course[]> {
    if (!useOpenSearch) {
      return this.courseService.search(filter, courseGroup)
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
    }

    const searchResult = await this.searchService.search<ICourseSearchDocument>({
      index: this.configService.get<string>('courseIndexName'),
      body: {
        query: buildCourseQuery({
          keyword: filter.keyword,
          genEdTypes: filter.genEdTypes,
          dayOfWeeks: filter.dayOfWeeks,
          periodRange: filter.periodRange,
          studyProgram: courseGroup.studyProgram,
          semester: courseGroup.semester,
          academicYear: courseGroup.academicYear,
        }),
        from: filter?.offset || 0,
        size: filter?.limit || 10,
      },
    })

    return searchResult.map((item) => item.rawData)
  }
}
