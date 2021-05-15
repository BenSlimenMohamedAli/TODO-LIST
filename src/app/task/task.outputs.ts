import { Task } from '@core/models/task.model';
import { paginationOutput } from '@core/utils/pagination/pagination.output';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskListOutput {
  @Field(() => paginationOutput)
  pagination: paginationOutput;

  @Field(() => [Task])
  list: Task[];
}
