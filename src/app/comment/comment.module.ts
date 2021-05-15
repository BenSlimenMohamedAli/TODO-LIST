import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from '@core/models/comment.model';
import { Task, TaskSchema } from '@core/models/task.model';
import { User, UserSchema } from '@core/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
