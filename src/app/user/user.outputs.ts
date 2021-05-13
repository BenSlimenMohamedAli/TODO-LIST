import { User } from '@core/models/user.model';
import { paginationOutput } from '@core/utils/pagination/pagination.output';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserListOutput {
  @Field(() => paginationOutput)
  pagination: paginationOutput;

  @Field(() => [User])
  list: User[];
}
