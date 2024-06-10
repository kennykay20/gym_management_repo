import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { config } from '../config';
import { Authentication } from '../utils/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userSvc: UserService,
    private jwtService: JwtService,
  ) {}

  loginUser = async (loginDto: LoginDto) => {
    try {
      let token = null;
      let flag: boolean;
      const { email, password } = loginDto;
      const isUser = await this.userSvc.getUserByEmail(email);
      if (!isUser) {
        throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
      }
      if (password) {
        const salt = isUser.password.split('.')[0];
        const hashPassword = isUser.password.split('.')[1];
        flag = Authentication.comparePassword(password, hashPassword, salt);
      }

      if (!flag) {
        throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
      }

      if (!isUser.isDelete) {
        token = await this.generateAuthToken(email, isUser.id);
      } else {
        throw new HttpException(
          'Please activate your account',
          HttpStatus.BAD_REQUEST,
        );
      }
      return token;
    } catch (error) {
      Logger.log(error);
    }
  };

  generateToken = (): string => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  generateAuthToken = async (
    email: string,
    userId: string,
  ): Promise<{ access_token: string }> => {
    const payloadToken = { email, userId };
    return {
      access_token: await this.jwtService.signAsync(payloadToken, {
        secret: config.Secret,
      }),
    };
  };

  generateOtp() {
    return Math.floor(Math.random() * (999999 - 111111) + 111111).toString();
  }

  verifyToken = async (token: string, secret: string) => {
    return await this.jwtService.verifyAsync(token, { secret });
  };
}
