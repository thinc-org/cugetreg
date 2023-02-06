import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchRequest, SearchSuggest, SuggestionName } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search<T>(req: SearchRequest): Promise<T[]> {
    const res = await this.elasticsearchService.search<T>(req)

    const hits = res.hits.hits
    return hits.map((item) => item._source)
  }

  async suggest<T>(req: SearchRequest): Promise<Record<SuggestionName, SearchSuggest<T>[]>> {
    return (await this.elasticsearchService.search<T>(req)).suggest
  }
}
