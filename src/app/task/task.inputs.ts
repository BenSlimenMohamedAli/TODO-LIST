import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;
}
