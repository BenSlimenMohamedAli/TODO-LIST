import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Task } from './task.model';
import { User } from './user.model';

@ObjectType()
@Schema()
export class Comment {
  @Field(() => String, { nullable: true })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  content: string;

  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Field(() => Task, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Task?.name })
  task: Types.ObjectId;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  updatedAt: Date;
}

export type CommentDocument = Comment & Document;

const CSchema = SchemaFactory.createForClass(Comment);

CSchema.pre<CommentDocument>('save', function (next) {
  this.createdAt = new Date();
  this.updatedAt = new Date();
  next();
});

CSchema.pre<CommentDocument>('updateOne', function (next) {
  this.update({ updatedAt: new Date() });
  next();
});

export const CommentSchema = CSchema;
