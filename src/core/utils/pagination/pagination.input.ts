import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class paginationInput {
  @Field(() => Number)
  page: number;

  @Field(() => Number)
  size: number;
}
