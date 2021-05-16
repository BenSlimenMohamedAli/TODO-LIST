import { User, UserDocument } from '@core/models/user.model';
import { setupPaginationOutput } from '@core/utils/pagination/pagination.functions';
import { paginationInput } from '@core/utils/pagination/pagination.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserInput, UpdateUserInput, UserFilters } from './user.inputs';
import { UserListOutput } from './user.outputs';
import { env, loadEnv } from '@env';
import { hashSync } from 'bcrypt';
loadEnv();

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.userModel.find({ role: 'admin' }).then((admins) => {
      if (!admins.length) {
        this.create({
          firstName: env.ADMIN_FIRSTNAME,
          lastName: env.ADMIN_LASTNAME,
          username: env.ADMIN_USERNAME,
          password: env.ADMIN_PASSWORD,
          role: env.ADMIN_ROLE,
        }).catch(() => {
          /***/
        });
      }
    });
  }

  findById(_id: Types.ObjectId) {
    return this.userModel.findById(_id).exec();
  }

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

  update(user: UpdateUserInput) {
    return this.userModel
      .updateOne({ _id: user._id }, user)
      .exec()
      .then((updated) => {
        return updated.nModified ? true : false;
      })
      .catch(() => {
        return false;
      });
  }

  countByUsername(username: string) {
    return this.userModel.countDocuments(
      { username: { $regex: '^' + username } },
      function (err, count) {
        return count;
      },
    );
  }

  delete(_id: Types.ObjectId) {
    return this.userModel
      .findByIdAndDelete(_id)
      .exec()
      .then(() => true)
      .catch(() => false);
  }

  async updatePassword(id, oldPassword, newPassword) {
    const user: any = await this.userModel.findOne({ _id: id }).exec();
    const isPasswordMatch = user.comparePassword(
      { user, password: oldPassword },
      (error, isMatch) => {
        if (isMatch) {
          return true;
        }
        return false;
      },
    );
    if (isPasswordMatch) {
      newPassword = hashSync(newPassword, 10);
      const success = await this.userModel
        .updateOne({ _id: id }, { password: newPassword })
        .exec();
      if (success.ok && success.nModified) return true;
    }

    return false;
  }
}
