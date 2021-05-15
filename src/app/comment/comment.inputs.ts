import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  task: Types.ObjectId;

  @Field(() => String)
  content: string;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  content: string;
}
