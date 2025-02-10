import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  Connection,
  createConnection,
  // MongoDBConnection,
  // MySQLConnection,
} from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
import {
  // createUserRepository,
  UserRepository,
} from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService, // Standard Provider
    {
      // Class Provider
      provide: Connection,
      // useClass:
      //   process.env.DATABASE === 'mysql' ? MySQLConnection : MongoDBConnection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    {
      // Value Provider
      provide: MailService,
      useValue: mailService,
    },
    {
      // Alias Provider
      provide: 'EmailService',
      useExisting: MailService,
    },
    // {
    //   // Factory Provider
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection],
    // },
    UserRepository,
    MemberService,
  ],
  exports: [UserService],
})
export class UserModule {}
