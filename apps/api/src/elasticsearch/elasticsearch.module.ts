import { Module } from '@nestjs/common'

import { ElasticsearchService } from './elasticsearch.service'

@Module({
  providers: [ElasticsearchService],
})
export class ElasticsearchModule {}
