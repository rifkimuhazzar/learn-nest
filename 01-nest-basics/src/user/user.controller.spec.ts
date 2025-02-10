import * as httpMock from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to get say hello', async () => {
    const response = await controller.sayHello('Express');
    expect(response).toBe('Hello Express');
  });

  it('should be able to view template', () => {
    const response = httpMock.createResponse();
    controller.viewHello(response, 'Express');

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      title: 'Template Engine',
      name: 'Express',
    });
  });
});
