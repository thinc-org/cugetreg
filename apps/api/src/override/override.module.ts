import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OverrideSchema } from '@cgr/schema'

import { OverrideResolver } from './override.resolver'
import { OverrideService } from './override.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'override', schema: OverrideSchema }])],
  providers: [OverrideResolver, OverrideService],
  exports: [OverrideService],
})
export class OverrideModule {}
