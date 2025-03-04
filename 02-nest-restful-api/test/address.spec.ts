import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
    });

    it('should not be able to create an address if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact!.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create an address request is valid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${contact!.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'Street Test',
          city: 'City Test',
          province: 'Province Test',
          country: 'Country Test',
          postal_code: '01010101',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Street Test');
      expect(response.body.data.city).toBe('City Test');
      expect(response.body.data.province).toBe('Province Test');
      expect(response.body.data.country).toBe('Country Test');
      expect(response.body.data.postal_code).toBe('01010101');
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should not be able to get an address if contactId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id + 1}/addresses/${address!.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should not be able to get an address if addressId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id}/addresses/${address!.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get an address request is valid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Street Test');
      expect(response.body.data.city).toBe('City Test');
      expect(response.body.data.province).toBe('Province Test');
      expect(response.body.data.country).toBe('Country Test');
      expect(response.body.data.postal_code).toBe('01010101');
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should not be able to update an address if request is invalid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update an address request is valid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'Street Test',
          city: 'City Test',
          province: 'Province Test',
          country: 'Country Test',
          postal_code: '01010101',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('Street Test');
      expect(response.body.data.city).toBe('City Test');
      expect(response.body.data.province).toBe('Province Test');
      expect(response.body.data.country).toBe('Country Test');
      expect(response.body.data.postal_code).toBe('01010101');
    });

    it('should be able to update an address if contactId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact!.id + 1}/addresses/${address!.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'Street Test',
          city: 'City Test',
          province: 'Province Test',
          country: 'Country Test',
          postal_code: '01010101',
        });

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update an address if addressId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact!.id}/addresses/${address!.id + 1}`)
        .set('Authorization', 'test')
        .send({
          street: 'Street Test',
          city: 'City Test',
          province: 'Province Test',
          country: 'Country Test',
          postal_code: '01010101',
        });

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should not be able to delete an address if contactId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact!.id + 1}/addresses/${address!.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should not be able to delete an address if addressId is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact!.id}/addresses/${address!.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete an address request is valid', async () => {
      const contact = await testService.getContact();
      let address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact!.id}/addresses/${address!.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      // check if address has been deleted
      address = await testService.getAddress();
      expect(address).toBeNull();
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    it('should not be able to get all addresses if contactId is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id + 1}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get all addresses request is valid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact!.id}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].street).toBe('Street Test');
      expect(response.body.data[0].city).toBe('City Test');
      expect(response.body.data[0].province).toBe('Province Test');
      expect(response.body.data[0].country).toBe('Country Test');
      expect(response.body.data[0].postal_code).toBe('01010101');
    });
  });
});
