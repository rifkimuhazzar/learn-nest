import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Contact, User } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ValidationService } from '../common/validation.service';
import { ContactValidation } from './contact.validation';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name ? contact.last_name : '',
      email: contact.email ? contact.email : '',
      phone: contact.phone,
    };
  }

  async checkContactMustExist(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findUnique({
      where: {
        id: contactId,
        user_username: username,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', 404);
    }

    return contact;
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const validatedRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const newContact = await this.prismaService.contact.create({
      data: {
        ...validatedRequest,
        user_username: user.username,
      },
    });

    return this.toContactResponse(newContact);
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, contactId);
    return this.toContactResponse(contact);
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const validatedRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );
    let contact = await this.checkContactMustExist(
      user.username,
      validatedRequest.id,
    );

    contact = await this.prismaService.contact.update({
      where: {
        id: validatedRequest.id,
      },
      data: validatedRequest,
    });

    return this.toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    await this.checkContactMustExist(user.username, contactId);
    const contact = await this.prismaService.contact.delete({
      where: {
        id: contactId,
        user_username: user.username,
      },
    });

    return this.toContactResponse(contact);
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    const validatedRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    );

    const filters: Array<any> = [];

    if (validatedRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: validatedRequest.name,
            },
          },
          {
            last_name: {
              contains: validatedRequest.name,
            },
          },
        ],
      });
    }
    if (validatedRequest.email) {
      filters.push({
        email: {
          contains: validatedRequest.email,
        },
      });
    }
    if (validatedRequest.phone) {
      filters.push({
        phone: {
          contains: validatedRequest.phone,
        },
      });
    }

    const contacts = await this.prismaService.contact.findMany({
      where: {
        user_username: user.username,
        AND: filters,
      },
      take: validatedRequest.size,
      skip: (validatedRequest.page - 1) * validatedRequest.size,
    });

    const totalContacts = await this.prismaService.contact.count({
      where: {
        user_username: user.username,
        AND: filters,
      },
    });

    return {
      data: contacts.map((contact) => this.toContactResponse(contact)),
      paging: {
        size: validatedRequest.size,
        current_page: validatedRequest.page,
        total_page: Math.ceil(totalContacts / validatedRequest.size),
      },
    };
  }
}
