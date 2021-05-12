import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationError } from 'apollo-server-express';
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
    const headers = context.getArgByIndex(2).req.headers;
    if (headers.authorization) {
      const decoded: any = jwt.verify(
        headers.authorization.replace('Bearer ', ''),
        env.JWT_SECRET,
      );
      if (decoded._id !== headers.userid) {
        throw new AuthenticationError('WRONGCREDENTIALS');
      }
    }
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    // Make sure to check the authorization, for now, just return false to have a difference between public routes.
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (e) {
      throw new AuthenticationError('WRONGTOKEN');
    }
  }
}
