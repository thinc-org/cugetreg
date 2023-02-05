import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSearchInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
