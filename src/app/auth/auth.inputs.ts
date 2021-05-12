import { Field, InputType } from '@nestjs/graphql';
import { loadEnv } from '@env';
loadEnv();

@InputType()
export class LoginInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
