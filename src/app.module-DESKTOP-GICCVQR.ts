import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AuthModule } from './app/auth/auth.module';
import { env, loadEnv } from '@env';
import { UserModule } from './app/user/user.module';
import { TaskModule } from './app/task/task.module';
loadEnv();

const MONGO_LINK = `mongodb://${env.MONGO_HOST}/${env.MONGO_DB}?authSource=${env.MONGO_AUTH_DB}`;

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_LINK, {
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/core/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      playground: process.env.NODE_ENV === 'dev',
      debug: false,
      uploads: true,
    }),
    AuthModule,
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
