import { CreateSearchInput } from './create-search.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSearchInput extends PartialType(CreateSearchInput) {
  @Field(() => Int)
  id: number;
}
