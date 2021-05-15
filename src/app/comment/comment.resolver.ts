import { JwtAuthGuard } from '@core/guards/auth.guard';
import { Comment, CommentDocument } from '@core/models/comment.model';
import { Task } from '@core/models/task.model';
import { User } from '@core/models/user.model';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateCommentInput, UpdateCommentInput } from './comment.inputs';
import { CommentService } from './comment.service';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Comment)
  async comment(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    const output: Comment = await this.commentService.findById(_id);
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Comment])
  async comment_list(
    @Args('taskId', { type: () => String }) taskId: Types.ObjectId,
  ) {
    const output: Comment[] = await this.commentService.listByTask(taskId);
    return output;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  comment_create(
    @Context() context: GraphQLExecutionContext,
    @Args('comment') comment: CreateCommentInput,
  ) {
    const {
      req: {
        cookies: { userId },
      },
    } = context as any;
    return this.commentService.create(comment, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  comment_update(@Args('comment') comment: UpdateCommentInput) {
    return this.commentService.update(comment);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  comment_delete(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.commentService.delete(_id);
  }

  @ResolveField()
  async task(
    @Parent() comment: CommentDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate)
      await comment.populate({ path: 'task', model: Task.name }).execPopulate();

    return comment.task;
  }

  @ResolveField()
  async user(
    @Parent() comment: CommentDocument,
    @Args('populate') populate: boolean,
  ) {
    if (populate)
      await comment.populate({ path: 'user', model: User.name }).execPopulate();

    return comment.user;
  }
}
