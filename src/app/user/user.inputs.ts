import { adminRoles } from '@core/static/adminRoles';
import { Field, InputType } from '@nestjs/graphql';
import { IsIn, Matches, MinLength } from 'class-validator';
import { env, loadEnv } from '@env';
loadEnv();

@InputType()
export class UserFilters {
  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  @IsIn(adminRoles)
  role: string;
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String)
  @IsIn(adminRoles)
  role: string;

  @Field(() => String)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  @MinLength(8)
  @Matches(new RegExp(env.PASSWORD_REGEX), {
    message: 'password too weak',
  })
  oldPassword: string;

  @Field(() => String)
  @MinLength(8)
  @Matches(new RegExp(env.PASSWORD_REGEX), {
    message: 'password too weak',
  })
  newPassword: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;
}
