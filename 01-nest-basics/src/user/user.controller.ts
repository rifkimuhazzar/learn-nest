import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  // Inject,
  // Optional,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  // UseGuards,
  UseInterceptors,
  UsePipes,
  // UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from './connection/connection';
import { MailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { User } from '@prisma/client';
import { ValidationPipe } from 'src/validation/validation.pipe';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationFilter } from 'src/validation/validation.filter';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
// import { RoleGuard } from 'src/role/role.guard';
import { roles } from 'src/role/roles.decorator';
// import { ValidationFilter } from 'src/validation/validation.filter';

@Controller('/api/users')
// @UseGuards(RoleGuard)
export class UserController {
  // @Inject()
  // @Optional()
  // private service: UserService;
  // constructor(@Optional() private service: UserService) {}
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private repository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/current')
  // @UseGuards(new RoleGuard(['Admin', 'operator']))
  // @UseGuards(RoleGuard)
  @roles(['Admin', 'operator']) // case-sensitive dengan di database
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @Post('/login')
  @UseFilters(ValidationFilter)
  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  // @Header('content-type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Query('name') name: string, @Body() request: LoginUserRequest) {
    // return `Hello ${request.username}`;
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    // this.repository.save();
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  @Get('/create')
  async create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string = '',
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        { code: 400, error: 'First name is required' },
        400,
      );
    }
    return await this.repository.save(firstName, lastName);
  }

  @Get('/hello')
  // @UseFilters(ValidationFilter)
  async sayHello(@Query('name') name: string): Promise<string> {
    return this.service.sayHello(name);
  }

  @Get('/view/hello')
  viewHello(@Res() res: Response, @Query('name') name: string) {
    res.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() res: Response): void {
    res.cookie('name', name);
    res.status(200).json({ data: 'Success set cookie' });
  }

  @Get('/get-cookie')
  getCookie(@Req() req: Request): string {
    return req.cookies['name'];
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/sample-response')
  @Header('content-type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return { data: 'Hello Nestjs' };
  }

  @Get('/sample-response')
  sampleResponse2(@Res() res: Response) {
    res.status(200).json({ data: 'Hello World' });
  }

  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get(): string {
    return 'Hello Nestjs';
  }

  @Get('/:id')
  getById2(@Param('id', ParseIntPipe) a: number): string {
    console.log(a * 10);
    return `GET ${a}`;
  }

  @Get('/:id')
  getById(@Req() req: Request): string {
    return `GET ${req.params.id}`;
  }
}
