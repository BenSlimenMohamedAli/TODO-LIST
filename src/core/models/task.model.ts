import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Comment } from './comment.model';

@ObjectType()
@Schema()
export class Task {
  @Field(() => String, { nullable: true })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  title: string;

  @Field(() => String, { nullable: true })
  @Prop()
  description: string;

  @Field(() => Boolean, { nullable: true })
  @Prop()
  completed: boolean;

  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId;

  @Field(() => [User], { nullable: true })
  @Prop({ type: Types.ObjectId, ref: User.name })
  sharedWith: Types.ObjectId[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  updatedAt: Date;
}

export type TaskDocument = Task & Document;

const TSchema = SchemaFactory.createForClass(Task);

TSchema.pre<TaskDocument>('save', function (next) {
  this.createdAt = new Date();
  this.updatedAt = new Date();
  next();
});

TSchema.pre<TaskDocument>('updateOne', function (next) {
  this.update({ updatedAt: new Date() });
  next();
});

export const TaskSchema = TSchema;
