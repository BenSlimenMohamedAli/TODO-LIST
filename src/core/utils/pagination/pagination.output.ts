import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class paginationOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  totalPages: number;

  @Field(() => Number)
  page: number;

  @Field(() => Number)
  size: number;
}
