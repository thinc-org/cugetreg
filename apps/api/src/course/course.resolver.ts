import { Args, Query, Resolver } from '@nestjs/graphql'

import { Semester, StudyProgram } from '@cgr/schema'

import { CourseGroupInput, FilterInput, Course as GraphQLCourse } from '../graphql'
import { CourseService } from './course.service'

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
  ): Promise<GraphQLCourse[]> {
    return this.courseService.search(filter, courseGroup)
  }
}
