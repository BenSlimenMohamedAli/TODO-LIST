import { JwtAuthGuard } from '@core/guards/auth.guard';
import { Task, TaskDocument } from '@core/models/task.model';
import { User } from '@core/models/user.model';
import { paginationInput } from '@core/utils/pagination/pagination.input';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreateTaskInput, TaskFilters, UpdateTaskInput } from './task.inputs';
import { TaskListOutput } from './task.outputs';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private usersService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Task)
  async task(
    @Context() context: GraphQLExecutionContext,
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;

    const output: Task = await this.taskService.findById(_id);

    let sharedWith;
    if (output?.sharedWith)
      sharedWith = JSON.parse(JSON.stringify(output?.sharedWith));

    if (
      userId.toString() !== output.owner.toString() &&
      !sharedWith?.includes(userId)
    )
      throw new ForbiddenError('WRONGACCESS');

    return output;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TaskListOutput)
  async task_list(
    @Args('pagination') pagination: paginationInput,
    @Args('filters', { nullable: true }) filters?: TaskFilters,
  ) {
    const output: TaskListOutput = await this.taskService.list(
      pagination,
      filters,
    );
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  task_create(
    @Context() context: GraphQLExecutionContext,
    @Args('task') task: CreateTaskInput,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;
    return this.taskService.create(task, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  task_update(@Args('task') task: UpdateTaskInput) {
    return this.taskService.update(task);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async task_share(
    @Args('userId', { type: () => String }) userId: Types.ObjectId,
    @Args('taskId', { type: () => String }) taskId: Types.ObjectId,
  ) {
    const task: Task = await this.taskService.findById(taskId);
    const user: User = await this.usersService.findById(userId);
    if (user && task && userId !== task.owner)
      return this.taskService.share(user, task);
    else return false;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async task_unlink(
    @Args('userId', { type: () => String }) userId: Types.ObjectId,
    @Args('taskId', { type: () => String }) taskId: Types.ObjectId,
  ) {
    const task: Task = await this.taskService.findById(taskId);
    const user: User = await this.usersService.findById(userId);
    if (user && task && userId !== task.owner)
      return this.taskService.unlink(user, task);
    else return false;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  task_delete(
    @Context() context: GraphQLExecutionContext,
    @Args('_id', { type: () => String }) _id: Types.ObjectId,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;
    return this.taskService.delete(_id, userId);
  }

  @ResolveField()
  async owner(
    @Parent() task: TaskDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate)
      await task.populate({ path: 'owner', model: User.name }).execPopulate();

    return task.owner;
  }

  @ResolveField()
  async sharedWith(
    @Parent() task: TaskDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate)
      await task
        .populate({ path: 'sharedWith', model: User.name })
        .execPopulate();

    return task.sharedWith;
  }
}
