import { JwtAuthGuard } from '@core/guards/auth.guard';
import { User } from '@core/models/user.model';
import { paginationInput } from '@core/utils/pagination/pagination.input';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput, UserFilters } from './user.inputs';
import { UserListOutput } from './user.outputs';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserListOutput)
  async user_list(
    @Args('pagination') pagination: paginationInput,
    @Args('filters', { nullable: true }) filters?: UserFilters,
  ) {
    const output: UserListOutput = await this.usersService.list(
      pagination,
      filters,
    );
    return output;
  }

  @Mutation(() => User)
  async user_create(@Args('user') user: CreateUserInput) {
    return this.usersService.create(user);
  }
}
