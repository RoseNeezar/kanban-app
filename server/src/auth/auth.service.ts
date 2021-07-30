import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import * as cookie from 'cookie';
import { Response } from 'express';
import { InjectModel } from 'nestjs-typegoose';
import * as shortId from 'shortid';
import { User } from 'src/models/user.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import { AuthCredentialDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async login(
    authCredentialDto: Pick<AuthCredentialDto, 'email'>,
    res: Response,
  ) {
    try {
      const { email } = authCredentialDto;

      const oldUser = await this.userModel.findOne({ email });

      if (oldUser) {
        return res.send(oldUser);
      }

      const user: User = {
        username: shortId.generate(),
        email,
      };

      const newUser = await this.userModel.create(user);

      return res.send(newUser);
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async logout(res: Response) {
    res.setHeader('Set-Cookie', this.getCookieForLogOut());
    return res.status(200).json({ success: true });
  }

  public getCookieForLogOut() {
    return cookie.serialize('tokenKanban', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });
  }

  public getCookieWithJwtToken(token: string) {
    return cookie.serialize('tokenKanban', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: +process.env.JWT_EXPIRATION_TIME,
      path: '/',
    });
  }

  public async getUserById(userId: number) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (user) {
        return user;
      }
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  public async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }

    const createUser: User = {
      username: shortId.generate(),
      email,
    };
    const newUser = await this.userModel.create(createUser);
    return newUser;
  }
}
