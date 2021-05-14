import { Task } from '@core/models/task.model';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => Task)
export class TaskResolver {}
