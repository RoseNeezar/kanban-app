import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/')
  getUsers() {
    return this.authService.getUser();
  }
}
