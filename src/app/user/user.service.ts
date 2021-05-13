import { User, UserDocument } from '@core/models/user.model';
import { setupPaginationOutput } from '@core/utils/pagination/pagination.functions';
import { paginationInput } from '@core/utils/pagination/pagination.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput, UserFilters } from './user.inputs';
import { UserListOutput } from './user.outputs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async list(
    pagination: paginationInput,
    filters: UserFilters,
  ): Promise<UserListOutput> {
    const filterObject = {
      ...filters,
      username: { $regex: `.*${filters?.username || ''}.*`, $options: '-i' },
    };
    const users: User[] = await this.userModel
      .find(filterObject)
      .limit(pagination.size)
      .skip((pagination.page - 1) * pagination.size)
      .exec();

    const total = await this.userModel.countDocuments(filterObject);
    const output = new UserListOutput();
    output.list = users;
    output.pagination = setupPaginationOutput(pagination, total);
    return output;
  }

  async create(user: CreateUserInput) {
    if (!user.username) {
      user.username =
        user.firstName.replace(' ', '').substring(0, 1).toLocaleLowerCase() +
        user.lastName.replace(' ', '').toLocaleLowerCase();

      const count = await this.countByUsername(user.username);

      if (count) {
        user.username = user.username + count;
      }
    }

    const newUser = new this.userModel(user);
    const output = newUser.save();
    return output;
  }

  countByUsername(username: string) {
    return this.userModel.countDocuments(
      { username: { $regex: '^' + username } },
      function (err, count) {
        return count;
      },
    );
  }
}
