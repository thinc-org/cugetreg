import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

import { configuration } from '@reg-scraper/config/configuration'
import { OverrideModule } from '@reg-scraper/override/override.module'
import { QueueConsumerModule } from '@reg-scraper/scraper/queue-consumer/queue-consumer.module'
import { ScraperModule } from '@reg-scraper/scraper/scraper.module'
import { QueueStoreModule } from '@reg-scraper/stores/queue-store/queue-store.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoURI'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('redisURL'),
        prefix: configService.get<string>('redisKeyPrefix'),
        limiter: {
          max: configService.get<number>('rateLimit.maxJobs'),
          duration: configService.get<number>('rateLimit.cycleDurationMs'),
          bounceBack: false,
        },
      }),
      inject: [ConfigService],
    }),
    ScraperModule,
    OverrideModule,
    QueueStoreModule,
    QueueConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
