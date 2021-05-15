import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@core/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: any = await this.userModel.findOne({ username }).exec();
    if (user) {
      return user.comparePassword({ user, password }, (error, isMatch) => {
        if (isMatch) {
          return user;
        }
        return null;
      });
    }

    return null;
  }

  generateAuthToken(user: any) {
    const payload = { _id: user._id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
