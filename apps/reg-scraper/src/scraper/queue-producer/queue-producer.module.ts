import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OverrideModule } from '@reg-scraper/override/override.module'
import { CourseSchema } from '@reg-scraper/schema/course.schema'
import { QueueStoreModule } from '@reg-scraper/stores/queue-store/queue-store.module'

import { QueueProducerService } from './queue-producer.service'

@Module({
  providers: [QueueProducerService],
  exports: [QueueProducerService],
  imports: [
    MongooseModule.forFeature([{ name: 'course', schema: CourseSchema }]),
    OverrideModule,
    QueueProducerModule,
    BullModule.registerQueue({
      name: 'fetch',
    }),
    QueueStoreModule,
  ],
})
export class QueueProducerModule {}
