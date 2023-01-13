import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from "@nestjs/schedule"
import { QueueConsumerModule } from "scraper/queue-consumer/queue-consumer.module"
import { ScraperModule } from "scraper/scraper.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { configuration } from "./config/configuration"
import { OverrideModule } from "./override/override.module"
import { QueueStoreModule } from "./stores/queue-store/queue-store.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongoURI"),
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>("redisURL"),
        prefix: configService.get<string>("redisKeyPrefix"),
        limiter: {
          max: configService.get<number>("rateLimit.maxJobs"),
          duration: configService.get<number>("rateLimit.cycleDurationMs"),
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
export class AppModule { }
