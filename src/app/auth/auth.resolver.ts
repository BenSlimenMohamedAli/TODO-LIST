import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { User } from '@core/models/user.model';
import { LoginInput } from './auth.inputs';
import { LoginOutput } from './auth.outputs';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(@Args('credentials') credentials: LoginInput) {
    const user: User = await this.authService.validateUser(
      credentials.username,
      credentials.password,
    );

    if (user)
      return {
        authorization: this.authService.generateAuthToken(user),
        _id: user._id,
        profile: user,
      };
    else throw new AuthenticationError('Email or password is Invalid');
  }
}
