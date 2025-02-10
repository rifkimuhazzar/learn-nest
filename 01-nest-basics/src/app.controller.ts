import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
