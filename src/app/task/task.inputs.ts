import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TaskFilters {
  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Boolean, { nullable: true })
  completed: boolean;

  @Field(() => String, { nullable: true })
  owner: string;
}

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Boolean, { nullable: true })
  completed: boolean;
}
