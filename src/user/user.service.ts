import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './models/user.model';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dtos/create.dto';
import { isValidEmail, isValidPassword } from 'src/utils/helpers';
import { Authentication } from 'src/utils/auth';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  async createUser(createUserDto: UserCreateDto) {
    const { email, password } = createUserDto;

    try {
      if (!email) {
        throw new HttpException('Please enter email', HttpStatus.BAD_REQUEST);
      }

      if (email && !isValidEmail(email)) {
        throw new HttpException(
          'Invalid email address supplied',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (password && !isValidPassword(password)) {
        throw new HttpException(
          'Password must be at least 5 characters with 1 uppercase',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userExist = await this.getUserByEmail(email);
      if (userExist) {
        throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
      }
      const user = new User();
      user.id = uuidv4();
      user.email = email;
      user.isActive = true;
      user.isDelete = false;
      user.deletedAt = null;

      if (password) {
        const salt = Authentication.generateSalt();
        const passwordHash = Authentication.generatePasswordHash(
          password,
          salt,
        );
        user.password = `${salt}.${passwordHash}`;
      }

      const saveUser = this.userRepo.save(user);
      delete (await saveUser).password;
      return saveUser;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const result = await this.userRepo.findOne({
        where: { id, isDelete: false },
      });

      if (!result) {
        throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      Logger.log(error);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const result = await this.userRepo.findOne({
        where: { email, isDelete: false },
      });
      return result;
    } catch (error) {
      Logger.log(error);
    }
  }
}
