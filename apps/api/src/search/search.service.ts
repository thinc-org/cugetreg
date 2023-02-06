import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search<T>(indexName: string, query: QueryDslQueryContainer): Promise<T[]> {
    const res = await this.elasticsearchService.search<T>({
      index: indexName,
      query: query,
    })

    const hits = res.hits.hits
    return hits.map((item) => item._source)
  }
}
