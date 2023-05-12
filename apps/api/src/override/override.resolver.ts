import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AdminAuthGuard } from '@api/auth/admin.guard'
import { CourseGroupInput, Override as GraphQLOverride, OverrideInput } from '@api/graphql'

import { Semester, StudyProgram } from '@cgr/schema'

import { OverrideService } from './override.service'

@Resolver('Override')
export class OverrideResolver {
  constructor(private readonly overrideService: OverrideService) {}

  @Query('overrides')
  getOverrides(): Promise<GraphQLOverride[]> {
    return this.overrideService.getOverrides()
  }

  @UseGuards(AdminAuthGuard)
  @Mutation('createOrUpdateOverride')
  createOrUpdateOverride(@Args('override') override: OverrideInput) {
    return this.overrideService.createOrUpdateOverride(override)
  }

  @UseGuards(AdminAuthGuard)
  @Mutation('deleteOverride')
  deleteOverride(
    @Args('courseNo') courseNo: string,
    @Args('courseGroup') courseGroup: CourseGroupInput
  ) {
    const { studyProgram, academicYear, semester } = courseGroup
    return this.overrideService.deleteOverride(
      courseNo,
      studyProgram as StudyProgram,
      academicYear,
      semester as Semester
    )
  }
}
