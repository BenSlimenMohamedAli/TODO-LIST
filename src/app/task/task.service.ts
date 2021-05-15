import { Task, TaskDocument } from '@core/models/task.model';
import { User } from '@core/models/user.model';
import { setupPaginationOutput } from '@core/utils/pagination/pagination.functions';
import { paginationInput } from '@core/utils/pagination/pagination.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskInput, TaskFilters, UpdateTaskInput } from './task.inputs';
import { TaskListOutput } from './task.outputs';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {}

  findById(_id: Types.ObjectId) {
    return this.taskModel.findById(_id).exec();
  }

  async list(
    pagination: paginationInput,
    filters: TaskFilters,
  ): Promise<TaskListOutput> {
    const filterObject = {
      ...filters,
      title: { $regex: `.*${filters?.title || ''}.*`, $options: '-i' },
    };
    const tasks: Task[] = await this.taskModel
      .find(filterObject)
      .limit(pagination.size)
      .skip((pagination.page - 1) * pagination.size)
      .exec();

    const total = await this.taskModel.countDocuments(filterObject);
    const output = new TaskListOutput();
    output.list = tasks;
    output.pagination = setupPaginationOutput(pagination, total);
    return output;
  }

  create(task: CreateTaskInput, owner: string): Promise<Task> {
    const newTask = new this.taskModel({ ...task, owner });
    const output = newTask.save();
    return output;
  }

  delete(_id: Types.ObjectId): Promise<boolean> {
    return this.taskModel
      .findByIdAndDelete(_id)
      .exec()
      .then(() => true)
      .catch(() => false);
  }

  share(user: User, task: Task): Promise<boolean> {
    return this.taskModel
      .updateOne({ _id: task._id }, { $addToSet: { sharedWith: user._id } })
      .exec()
      .then((updated) => {
        return updated.nModified ? true : false;
      })
      .catch(() => {
        return false;
      });
  }

  unlink(user: User, task: Task): Promise<boolean> {
    return this.taskModel
      .updateOne({ _id: task._id }, { $pull: { sharedWith: user._id } })
      .exec()
      .then((updated) => {
        return updated.nModified ? true : false;
      })
      .catch(() => {
        return false;
      });
  }

  update(task: UpdateTaskInput) {
    return this.taskModel
      .updateOne({ _id: task._id }, task)
      .exec()
      .then((updated) => {
        return updated.nModified ? true : false;
      })
      .catch(() => {
        return false;
      });
  }
}
