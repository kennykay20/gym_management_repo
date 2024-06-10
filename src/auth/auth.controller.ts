import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  LoginUser(@Body() login: LoginDto) {
    return this.authSvc.loginUser(login);
  }
}
