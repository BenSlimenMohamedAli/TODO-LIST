import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class User {
  @Field(() => String, { nullable: true })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  firstName: string;

  @Field(() => String, { nullable: true })
  @Prop()
  lastName: string;

  @Field(() => String, { nullable: true })
  @Prop({ unique: true })
  username: string;

  @Field(() => String, { nullable: true })
  @Prop()
  password: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  updatedAt: Date;
}

export type UserDocument = User & Document;

const USchema = SchemaFactory.createForClass(User);

USchema.pre<UserDocument>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.createdAt = new Date();
  this.updatedAt = new Date();
  this.password = hashSync(this.password, 10);
  next();
});

USchema.pre<UserDocument>('updateOne', function (next) {
  this.update({ updatedAt: new Date() });
  next();
});

USchema.methods.comparePassword = function ({ user, password }, callback) {
  return callback(null, compareSync(password, user.password));
};

export const UserSchema = USchema;
