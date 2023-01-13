import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { OverrideModule } from "override/override.module"
import { CourseSchema } from "schema/course.schema"
import { QueueStoreModule } from "stores/queue-store/queue-store.module"
import { QueueConsumerService } from "./queue-consumer.service"

@Module({
  providers: [QueueConsumerService],
  imports: [
    MongooseModule.forFeature([{ name: "course", schema: CourseSchema }]),
    OverrideModule,
    QueueStoreModule,
    BullModule.registerQueue({
      name: "fetch",
    }),
  ],
})
export class QueueConsumerModule {}
