# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "Hello",
  "last_name": "World",
  "email": "helloworld@example.com",
  "phone": "010101010101"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Hello",
    "last_name": "World",
    "email": "helloworld@example.com",
    "phone": "010101010101"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Hello",
    "last_name": "World",
    "email": "helloworld@example.com",
    "phone": "010101010101"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Search Contact

Endpoint: GET /api/contacts

Headers:

- Authorization: token

Query Params:

- name: string, contact first_name or contact last_name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- size: number, default 10

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Hello",
      "last_name": "World 1",
      "email": "helloworld1@example.com",
      "phone": "010101010101"
    },
    {
      "id": 2,
      "first_name": "Hello",
      "last_name": "World 2",
      "email": "helloworld2@example.com",
      "phone": "020202020202"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Update Contact

Endpoint: PUT /api/contacts/:contactId

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "New",
  "last_name": "Name",
  "email": "newname@example.com",
  "phone": "020202020202"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "New",
    "last_name": "Name",
    "email": "newname@example.com",
    "phone": "020202020202"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Error message"]
}
```

## Delete Contact

Endpoint: DELETE /api/contacts/:contactId

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
