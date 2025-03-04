import { hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteAddress();
    await this.deleteContact();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        user_username: 'test',
      },
    });
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          user_username: 'test',
        },
      },
    });
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await hash('test', 10),
        name: 'test',
        token: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@example.com',
        phone: '010101010101',
        user_username: 'test',
      },
    });
  }

  async createAddress() {
    const contact = await this.getContact();
    await this.prismaService.address.create({
      data: {
        street: 'Street Test',
        city: 'City Test',
        province: 'Province Test',
        country: 'Country Test',
        postal_code: '01010101',
        contact_id: contact!.id,
      },
    });
  }

  async getContact() {
    return await this.prismaService.contact.findFirst({
      where: {
        user_username: 'test',
      },
    });
  }

  getAddress() {
    return this.prismaService.address.findFirst({
      where: {
        contact: {
          user_username: 'test',
        },
      },
    });
  }
}
