export class CreateAddressRequest {
  street: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  contact_id: number;
}

export class GetAddressRequest {
  contact_id: number;
  address_id: number;
}

export class UpdateAddressRequest {
  id: number;
  street: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  contact_id: number;
}

export class RemoveAddressRequest {
  contact_id: number;
  address_id: number;
}

export class AddressResponse {
  id: number;
  street: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
}
