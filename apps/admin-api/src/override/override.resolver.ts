import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Override as GraphQLOverride, OverrideInput } from '@admin-api/graphql'

import { GenEdType } from '@cgr/schema'

import { OverrideService } from './override.service'

@Resolver('Override')
export class OverrideResolver {
  constructor(private readonly overrideService: OverrideService) {}

  @Query('overrides')
  getOverrides(@Args('genEdType') genEdType?: GenEdType): Promise<GraphQLOverride[]> {
    return this.overrideService.getOverrides(genEdType)
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
