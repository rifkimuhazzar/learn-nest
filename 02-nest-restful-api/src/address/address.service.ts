import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Address, User } from '@prisma/client';

import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street || '',
      city: address.city || '',
      province: address.province || '',
      country: address.country,
      postal_code: address.postal_code,
    };
  }

  async checkAddressMustExist(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findUnique({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });
    if (!address) {
      throw new HttpException('Address is not found', 404);
    }
    return address;
  }

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const validatedRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactMustExist(
      user.username,
      validatedRequest.contact_id,
    );

    const address = await this.prismaService.address.create({
      data: validatedRequest,
    });

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const validatedRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );
    await this.contactService.checkContactMustExist(
      user.username,
      validatedRequest.contact_id,
    );
    const address = await this.checkAddressMustExist(
      validatedRequest.contact_id,
      validatedRequest.address_id,
    );
    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const validatedRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );
    await this.contactService.checkContactMustExist(
      user.username,
      validatedRequest.contact_id,
    );
    let address = await this.checkAddressMustExist(
      validatedRequest.contact_id,
      validatedRequest.id,
    );
    address = await this.prismaService.address.update({
      data: validatedRequest,
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
    });
    return this.toAddressResponse(address);
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const validatedRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );
    await this.contactService.checkContactMustExist(
      user.username,
      validatedRequest.contact_id,
    );
    await this.checkAddressMustExist(
      validatedRequest.contact_id,
      validatedRequest.address_id,
    );
    const address = await this.prismaService.address.delete({
      where: {
        id: validatedRequest.address_id,
        contact_id: validatedRequest.contact_id,
      },
    });
    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.checkContactMustExist(user.username, contactId);
    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });
    return addresses.map((address) => this.toAddressResponse(address));
  }
}
