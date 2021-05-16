import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/user/user.module';
import { TaskModule } from './app/task/task.module';
import { CommentModule } from './app/comment/comment.module';
import { GraphqlModule } from './core/graphql.module';
import { DatabaseModule } from '@core/database.module';

@Module({
  imports: [
    GraphqlModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    TaskModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
