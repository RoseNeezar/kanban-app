import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReturnModelType } from '@typegoose/typegoose';
import { Response } from 'express';
import { User } from 'src/models/user.model';
import { AuthCredentialDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.register(authCredentialDto);
  }

  @Post('/login')
  login(
    @Res() res: Response,
    @Body(ValidationPipe) authCredentialDto: Omit<AuthCredentialDto, 'email'>,
  ): Promise<any> {
    return this.authService.login(authCredentialDto, res);
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: ReturnModelType<typeof User>) {
    return user;
  }
}
