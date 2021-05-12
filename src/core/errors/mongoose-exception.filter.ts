import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { MongoError } from 'mongodb';
@Catch(MongoError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    return new ApolloError(exception.message, `${exception.code}`, []);
  }
}
