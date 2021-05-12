import { User } from '@core/models/user.model';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => String)
  async user_list() {
    return 'its working';
  }
}
