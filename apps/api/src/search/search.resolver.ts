import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { Search } from './entities/search.entity';
import { CreateSearchInput } from './dto/create-search.input';
import { UpdateSearchInput } from './dto/update-search.input';

@Resolver(() => Search)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Mutation(() => Search)
  createSearch(@Args('createSearchInput') createSearchInput: CreateSearchInput) {
    return this.searchService.create(createSearchInput);
  }

  @Query(() => [Search], { name: 'search' })
  findAll() {
    return this.searchService.findAll();
  }

  @Query(() => Search, { name: 'search' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.searchService.findOne(id);
  }

  @Mutation(() => Search)
  updateSearch(@Args('updateSearchInput') updateSearchInput: UpdateSearchInput) {
    return this.searchService.update(updateSearchInput.id, updateSearchInput);
  }

  @Mutation(() => Search)
  removeSearch(@Args('id', { type: () => Int }) id: number) {
    return this.searchService.remove(id);
  }
}
