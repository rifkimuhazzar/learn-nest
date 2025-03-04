import * as bcrypt from 'bcrypt';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuidV4 } from 'uuid';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import { ValidationService } from '../common/validation.service';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const validatedRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    const sameUsernameCount = await this.prismaService.user.count({
      where: {
        username: validatedRequest.username,
      },
    });

    if (sameUsernameCount != 0) {
      throw new HttpException('Username already exist', 400);
    }

    validatedRequest.password = await bcrypt.hash(
      validatedRequest.password,
      10,
    );

    const user = await this.prismaService.user.create({
      data: validatedRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const validatedRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: validatedRequest.username,
      },
    });
    if (!user) {
      throw new HttpException('Username or password is wrong', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      validatedRequest.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Username or password is wrong', 401);
    }

    user = await this.prismaService.user.update({
      data: {
        token: uuidV4(),
      },
      where: {
        username: validatedRequest.username,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token!,
    };
  }

  get(user: User): UserResponse {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const validatedRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (validatedRequest.password) {
      user.password = await bcrypt.hash(validatedRequest.password, 10);
    }
    if (validatedRequest.name) {
      user.name = validatedRequest.name;
    }

    const updatedUser = await this.prismaService.user.update({
      data: user,
      where: {
        username: user.username,
      },
    });

    return {
      username: updatedUser.username,
      name: updatedUser.name,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      data: {
        token: null,
      },
      where: {
        username: user.username,
      },
    });

    return {
      username: result.username,
      name: result.name,
    };
  }
}
