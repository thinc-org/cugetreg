import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OverrideModule } from '@reg-scraper/override/override.module'
import { QueueStoreModule } from '@reg-scraper/stores/queue-store/queue-store.module'

import { CourseSchema, ModelName } from '@cgr/schema'

import { QueueConsumerService } from './queue-consumer.service'

@Module({
  providers: [QueueConsumerService],
  imports: [
    MongooseModule.forFeature([{ name: ModelName.Course, schema: CourseSchema }]),
    OverrideModule,
    QueueStoreModule,
    BullModule.registerQueue({
      name: 'fetch',
    }),
  ],
})
export class QueueConsumerModule {}
