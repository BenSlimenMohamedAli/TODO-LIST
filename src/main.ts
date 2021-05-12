import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongooseExceptionFilter } from '@core/errors/mongoose-exception.filter';
import { ValidationException } from '@core/errors/validation.exception';
import { ValidationFilter } from '@core/errors/validation.filter';
import * as cookieParser from 'cookie-parser';
import { loadEnv, env } from '@env';

async function bootstrap() {
  await loadEnv();
  const app = await NestFactory.create(AppModule);
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
  await app.listen(env.PORT);
}
bootstrap();
