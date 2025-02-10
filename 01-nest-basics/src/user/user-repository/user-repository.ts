import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  // connection: Connection;
  // save() {
  //   console.log(`Save user with connection ${this.connection.getName()}`);
  // }

  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('Create user repository');
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    this.logger.info(
      `Create user with first name ${firstName} and last name ${lastName}`,
    );
    return await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}

// export function createUserRepository(connection: Connection): UserRepository {
//   const repository = new UserRepository();
//   repository.connection = connection;
//   return repository;
// }
