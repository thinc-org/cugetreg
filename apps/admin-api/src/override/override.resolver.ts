import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Override as GraphQLOverride, OverrideInput } from '@admin-api/graphql'

import { OverrideService } from './override.service'

@Resolver('Override')
export class OverrideResolver {
  constructor(private readonly overrideService: OverrideService) {}

  @Query('overrides')
  getOverrides(): Promise<GraphQLOverride[]> {
    return this.overrideService.getOverrides()
  }

  @Mutation('createOrUpdateOverride')
  createOrUpdateOverride(@Args('override') override: OverrideInput) {
    return this.overrideService.createOrUpdateOverride(override)
  }

  @Mutation('deleteOverride')
  deleteOverride(@Args('courseNo') courseNo: string) {
    return this.overrideService.deleteOverride(courseNo)
  }
}
