import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcryptjs';
import * as cookie from 'cookie';
import { Response } from 'express';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'src/models/user.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import { AuthCredentialDto, TokenPayload } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialDto: AuthCredentialDto) {
    const { email, password, username } = authCredentialDto;
    const user: User = {
      username,
      email,
      password,
    };
    try {
      await this.userModel.create(user);
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async login(
    authCredentialDto: Omit<AuthCredentialDto, 'email'>,
    res: Response,
  ) {
    try {
      const { username, password } = authCredentialDto;

      const user = await this.userModel
        .findOne({ username })
        .select('+password');

      if (!user) {
        throw new BadRequestException();
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new BadRequestException();
      }
      const cookie = this.getCookieWithJwtToken(user._id);

      res.setHeader('Set-Cookie', cookie);
      user.password = undefined;
      return res.send(user);
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

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
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

  public async customGetUserById(userId: number) {
    const user = await this.userModel.findOne({ id: userId });
    if (user) {
      return user;
    }
    return null;
  }
}
