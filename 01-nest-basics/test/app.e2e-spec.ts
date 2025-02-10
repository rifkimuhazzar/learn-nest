import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /api/users/hello', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/hello')
      .query({
        first_name: 'React',
        last_name: 'Next',
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello React Next');
  });
});
