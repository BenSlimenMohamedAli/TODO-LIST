import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '@core/models/task.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TaskService, TaskResolver],
})
export class TaskModule {}
