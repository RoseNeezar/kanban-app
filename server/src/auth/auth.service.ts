import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async getUser() {
    try {
      const res = await this.userModel.create(
        {
          username: 'ww',
          email: 'heleddede',
          password: 'qq',
        },
        {
          validateBeforeSave: true,
        },
      );

      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
