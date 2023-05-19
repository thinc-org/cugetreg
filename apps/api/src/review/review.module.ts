import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ModelName, ReviewSchema } from '@cgr/schema'

import { ReviewResolver } from './review.resolver'
import { ReviewService } from './review.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: ModelName.Review, schema: ReviewSchema }])],
  providers: [ReviewResolver, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
