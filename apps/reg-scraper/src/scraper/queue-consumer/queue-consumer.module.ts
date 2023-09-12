import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { OpensearchModule } from 'nestjs-opensearch'

import { OverrideModule } from '@reg-scraper/override/override.module'
import { QueueStoreModule } from '@reg-scraper/stores/queue-store/queue-store.module'

import { CourseSchema, ModelName } from '@cgr/schema'

import { QueueConsumerService } from './queue-consumer.service'

@Module({
  providers: [QueueConsumerService],
  imports: [
    MongooseModule.forFeature([{ name: ModelName.Course, schema: CourseSchema }]),
    OpensearchModule.forRootAsync({
      clientName: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          nodes: configService.get<string>('opensearch.url'),
          auth: {
            username: configService.get<string>('opensearch.username'),
            password: configService.get<string>('opensearch.password'),
          },
          ssl: {
            rejectUnauthorized: !configService.get<boolean>('opensearch.skipSSL'),
          },
        }
      },
    }),
    OverrideModule,
    QueueStoreModule,
    BullModule.registerQueue({
      name: 'fetch',
    }),
  ],
})
export class QueueConsumerModule {}
