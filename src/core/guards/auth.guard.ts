import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { env, loadEnv } from '@env';
loadEnv();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cookies = this.getRequest(context)?.cookies;
    let decoded: any = null;
    const authorization = cookies?.authorization;
    const userId = cookies?.userId;

    if (!authorization || !userId)
      throw new AuthenticationError('WRONGCREDENTIALS');

    let wrongCredentials = false;
    if (authorization && authorization.length) {
      decoded = jwt.verify(
        authorization.replace('Bearer ', ''),
        env.JWT_SECRET,
      );
      if (decoded._id !== userId) {
        wrongCredentials = true;
      }
    } else {
      throw new AuthenticationError('WRONGCREDENTIALS');
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles && !roles.includes(decoded.role)) {
      throw new ForbiddenError('WRONGACCESS');
    }

    if (wrongCredentials) throw new AuthenticationError('WRONGCREDENTIALS');

    // Make sure to check the authorization, for now, just return false to have a difference between public routes.
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (e) {
      throw new AuthenticationError('WRONGTOKEN');
    }
  }
}
