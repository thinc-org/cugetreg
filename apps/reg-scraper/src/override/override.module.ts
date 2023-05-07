import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OverrideSchema, ReviewSchema } from '@cgr/schema'

import { OverrideService } from './override.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'override', schema: OverrideSchema }]),
    MongooseModule.forFeature([{ name: 'review', schema: ReviewSchema }]),
  ],
  providers: [OverrideService],
  exports: [OverrideService],
})
export class OverrideModule {}
