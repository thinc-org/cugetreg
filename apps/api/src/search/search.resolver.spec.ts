import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { SearchService } from './search.service';

describe('SearchResolver', () => {
  let resolver: SearchResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchResolver, SearchService],
    }).compile();

    resolver = module.get<SearchResolver>(SearchResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
