import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongooseExceptionFilter } from '@core/errors/mongoose-exception.filter';
import { ValidationException } from '@core/errors/validation.exception';
import { ValidationFilter } from '@core/errors/validation.filter';
import * as cookieParser from 'cookie-parser';
import { loadEnv, env } from '@env';

export async function bootstrap(app) {
  await loadEnv();
  app.use(cookieParser());
  app.useGlobalFilters(new ValidationFilter(), new MongooseExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          };
        });
        return new ValidationException(messages);
      },
    }),
  );
  app.enableCors({
    origin: true,
    credentials: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
}

async function start() {
  const app = await NestFactory.create(AppModule);
  bootstrap(app);
  await app.listen(env.PORT);
}

start();
