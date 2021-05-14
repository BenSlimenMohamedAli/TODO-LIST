import { Task, TaskDocument } from '@core/models/task.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskInput } from './task.inputs';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  create(task: CreateTaskInput): Promise<Task> {
    const newTask = new this.taskModel(task);
    const output = newTask.save();
    return output;
  }

  delete(_id: Types.ObjectId) {
    return this.taskModel
      .findByIdAndDelete(_id)
      .exec()
      .then(() => true)
      .catch(() => false);
  }
}
