import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@core/models/task.model';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '@core/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TaskResolver, TaskService, UserService],
})
export class TaskModule {}
