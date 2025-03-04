import { z } from 'zod';

export class AddressValidation {
  static readonly CREATE = z.object({
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().positive(),
  });

  static readonly GET = z.object({
    contact_id: z.number().positive(),
    address_id: z.number().positive(),
  });

  static readonly UPDATE = z.object({
    id: z.number().positive(),
    street: z.string().min(1).max(255).optional(),
    city: z.string().min(1).max(100).optional(),
    province: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100),
    postal_code: z.string().min(1).max(10),
    contact_id: z.number().positive(),
  });

  static readonly REMOVE = z.object({
    contact_id: z.number().positive(),
    address_id: z.number().positive(),
  });
}
