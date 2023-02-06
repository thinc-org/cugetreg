import { Args, Query, Resolver } from '@nestjs/graphql'

import { Course, Semester, StudyProgram } from '@thinc-org/chula-courses'

import { CourseGroupInput, FilterInput } from '../graphql'
import { CourseService } from './course.service'
import { ICourseSearchDocument } from './interface/course.interface'

@Resolver('Course')
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query('courseNos')
  courseNos(): Promise<Record<StudyProgram, string[]>> {
    return this.courseService.getAllCourseNos()
  }

  @Query('course')
  findOne(
    @Args('courseNo') courseNo: string,
    @Args('courseGroup')
    { semester, academicYear, studyProgram }: CourseGroupInput
  ): Promise<Course> {
    return this.courseService.findOne(courseNo, semester as Semester, academicYear, studyProgram)
  }

  @Query('search')
  async search(
    @Args('filter') filter: FilterInput,
    @Args('courseGroup') courseGroup: CourseGroupInput
  ): Promise<ICourseSearchDocument[]> {
    return this.courseService.search({
      academicYear: courseGroup.academicYear,
      semester: courseGroup.semester,
      studyProgram: courseGroup.studyProgram,
      dayOfWeeks: filter.dayOfWeeks,
      genEdTypes: filter.genEdTypes,
      limit: filter.limit,
      offset: filter.offset,
      keyword: filter.keyword,
      periodRange: filter.periodRange,
    })
  }

  @Query('suggest')
  async suggest(@Args('text') text: string): Promise<string[]> {
    return this.courseService.suggest(text)
  }
}
