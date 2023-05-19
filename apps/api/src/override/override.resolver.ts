import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AdminAuthGuard } from '@api/auth/admin.guard'
import { Override as GraphQLOverride, OverrideInput } from '@api/graphql'

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
  deleteOverride(@Args('courseNo') courseNo: string) {
    return this.overrideService.deleteOverride(courseNo)
  }
}
