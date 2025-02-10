import * as cookieParser from 'cookie-parser';
import * as mustacheExpress from 'mustache-express';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationFilter } from './validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser('My Secret Key'));

  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(loggerService);

  app.set('views', __dirname + '/../views');
  app.set('view engine', 'html');
  app.engine('html', mustacheExpress());

  app.useGlobalFilters(new ValidationFilter());
  // app.useGlobalPipes();
  // app.useGlobalInterceptors();
  // app.useGlobalGuards();

  app.enableShutdownHooks();

  // await app.listen(process.env.PORT ?? 3000);
  // await app.listen(process.env.PORT);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
