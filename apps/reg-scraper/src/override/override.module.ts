import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ModelName, OverrideSchema, ReviewSchema } from '@cgr/schema'

import { OverrideService } from './override.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.Override, schema: OverrideSchema }]),
    MongooseModule.forFeature([{ name: ModelName.Review, schema: ReviewSchema }]),
  ],
  providers: [OverrideService],
  exports: [OverrideService],
})
export class OverrideModule {}
