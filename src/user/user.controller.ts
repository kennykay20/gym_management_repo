import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dtos/create.dto';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  CreateUser(@Body() createUserDto: UserCreateDto) {
    return this.userSvc.createUser(createUserDto);
  }
}
