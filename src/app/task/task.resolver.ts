import { Task } from '@core/models/task.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateTaskInput } from './task.inputs';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Mutation(() => Task)
  task_create(@Args('task') task: CreateTaskInput) {
    return this.taskService.create(task);
  }

  @Mutation(() => Boolean)
  task_delete(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.taskService.delete(_id);
  }
}
