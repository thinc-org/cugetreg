import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OverrideModule } from "override/override.module"
import { CourseSchema } from "schema/course.schema"
import { QueueStoreModule } from "stores/queue-store/queue-store.module"
import { QueueProducerModule } from "./queue-producer/queue-producer.module"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "course", schema: CourseSchema }]),
    OverrideModule,
    QueueProducerModule,
    QueueStoreModule,
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
