import { Module } from '@nestjs/common'

import { QueueStoreService } from './queue-store.service'

@Module({
  providers: [QueueStoreService],
  exports: [QueueStoreService],
})
export class QueueStoreModule {}
