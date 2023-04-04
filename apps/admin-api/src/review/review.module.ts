import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ReviewSchema } from '../schemas/review.schema'
import { ReviewCron } from './review.cron'
import { ReviewResolver } from './review.resolver'
import { ReviewService } from './review.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'review', schema: ReviewSchema }])],
  providers: [ReviewResolver, ReviewService, ReviewCron],
  exports: [ReviewService],
})
export class ReviewModule {}
