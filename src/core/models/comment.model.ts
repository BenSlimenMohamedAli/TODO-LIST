import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Comment {
  @Field(() => String, { nullable: true })
  @Prop()
  title: string;

  @Field(() => String, { nullable: true })
  @Prop()
  content: string;

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
