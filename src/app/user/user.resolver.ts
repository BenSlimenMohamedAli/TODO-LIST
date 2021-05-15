import { Roles } from '@core/decorators/roles.decorator';
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
import { Types } from 'mongoose';
import {
  CreateUserInput,
  UpdatePasswordInput,
  UpdateUserInput,
  UserFilters,
} from './user.inputs';
import { UserListOutput } from './user.outputs';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
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

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Query(() => User)
  async user(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    const output: User = await this.usersService.findById(_id);
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Mutation(() => User)
  async user_create(@Args('user') user: CreateUserInput) {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Mutation(() => Boolean)
  async user_update(@Args('user') user: UpdateUserInput) {
    return this.usersService.update(user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async user_password_update(
    @Context() context: GraphQLExecutionContext,
    @Args('_id') _id: string,
    @Args('passwords') passwords: UpdatePasswordInput,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;
    if (_id !== userId) return false;
    return this.usersService.updatePassword(_id, passwords.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Mutation(() => Boolean)
  user_delete(
    @Context() context: GraphQLExecutionContext,
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;

    if (_id === userId) return false;
    return this.usersService.delete(_id);
  }
}
