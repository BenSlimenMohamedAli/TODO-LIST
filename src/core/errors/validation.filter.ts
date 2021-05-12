import { Catch } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements GqlExceptionFilter {
  catch(exception: ValidationException, host: GqlArgumentsHost): any {
    throw new ApolloError(
      'input failed to be validated',
      'GRAPHQL_VALIDATION_FAILED',
      exception.validationErrors,
    );
  }
}
