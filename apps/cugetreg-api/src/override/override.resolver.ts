import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { StudyProgram } from '@thinc-org/chula-courses'

import { AdminAuthGuard } from '../auth/admin.guard'
import { OverrideInput } from '../graphql'
import { OverrideService } from './override.service'

@Resolver('Override')
export class OverrideResolver {
  constructor(private readonly overrideService: OverrideService) {}

  @UseGuards(AdminAuthGuard)
  @Mutation('createOrUpdateOverride')
  createOrUpdateOverride(@Args('override') override: OverrideInput) {
    return this.overrideService.createOrUpdateOverride(override)
  }

  @UseGuards(AdminAuthGuard)
  @Mutation('deleteOverride')
  deleteOverride(
    @Args('courseNo') courseNo: string,
    @Args('studyProgram') studyProgram: StudyProgram
  ) {
    return this.overrideService.deleteOverride(courseNo, studyProgram)
  }
}
