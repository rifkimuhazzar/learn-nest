# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:contactId/addresses

Headers:

- Authorization: token

Request Body:

```json
{
  "street": "Street", // optional
  "city": "City", // optional
  "province": "Province", // optional
  "country": "Country",
  "postal_code": "01010"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Street", // null if doesn't exist
    "city": "City", // null if doesn't exist
    "province": "Province", // null if doesn't exist
    "country": "Country",
    "postal_code": "01010"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Get Address

Endpoint: GET /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Street", // null if doesn't exist
    "city": "City", // null if doesn't exist
    "province": "Province", // null if doesn't exist
    "country": "Country",
    "postal_code": "01010"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## List Address

Endpoint: GET /api/contacts/:contactId/addresses

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "street": "Street", // null if doesn't exist
      "city": "City", // null if doesn't exist
      "province": "Province", // null if doesn't exist
      "country": "Country",
      "postal_code": "01010"
    },
    {
      "id": 2,
      "street": "Street", // null if doesn't exist
      "city": "City", // null if doesn't exist
      "province": "Province", // null if doesn't exist
      "country": "Country",
      "postal_code": "01010"
    }
  ]
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Update Address

Endpoint: PUT /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: token

Request Body:

```json
{
  "street": "Street", // empty if doesn't exist
  "city": "City", // empty if doesn't exist
  "province": "Province", // empty if doesn't exist
  "country": "Country",
  "postal_code": "01010"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "street": "Street", // null if doesn't exist
    "city": "City", // null if doesn't exist
    "province": "Province", // null if doesn't exist
    "country": "Country",
    "postal_code": "01010"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Delete Address

Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": true
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```
