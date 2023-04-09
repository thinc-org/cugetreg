import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CourseGroupInput, OverrideInput } from '@admin-api/graphql'
import { Override } from '@admin-api/schemas/override.schema'

import { OverrideService } from './override.service'

@Resolver('Override')
export class OverrideResolver {
  constructor(private readonly overrideService: OverrideService) {}

  @Query('overrides')
  getOverrides(): Promise<Override[]> {
    return this.overrideService.getOverrides()
  }

  @Mutation('createOrUpdateOverride')
  createOrUpdateOverride(@Args('override') override: OverrideInput) {
    return this.overrideService.createOrUpdateOverride(override)
  }

  @Mutation('deleteOverride')
  deleteOverride(
    @Args('courseNo') courseNo: string,
    @Args('courseGroup') courseGroup: CourseGroupInput
  ) {
    const { studyProgram, academicYear, semester } = courseGroup
    return this.overrideService.deleteOverride(courseNo, studyProgram, academicYear, semester)
  }
}
