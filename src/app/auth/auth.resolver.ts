import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { User } from '@core/models/user.model';
import { LoginInput } from './auth.inputs';
import { LoginOutput } from './auth.outputs';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(
    @Context() context: GraphQLExecutionContext,
    @Args('credentials') credentials: LoginInput,
  ) {
    const user: User = await this.authService.validateUser(
      credentials.username,
      credentials.password,
    );

    if (user) {
      const token = this.authService.generateAuthToken(user);
      context['res'].cookie('authorization', token, {
        sameSite: 'strict',
        httpOnly: true,
      });
      context['res'].cookie('userId', user._id, {
        sameSite: 'strict',
        httpOnly: true,
      });
      context['res'].header('Access-Control-Allow-Credentials', 'true');
      return {
        authorization: token,
        userId: user._id,
        profile: user,
      };
    } else throw new AuthenticationError('Email or password is Invalid');
  }
}
