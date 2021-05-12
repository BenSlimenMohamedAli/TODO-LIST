import { User } from '@core/models/user.model';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  authorization: string;

  @Field(() => String)
  _id: string;

  @Field(() => User)
  profile: User;
}
