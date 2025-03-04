# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "helloworld",
  "password": "helloworld123",
  "name": "Hello World"
}
```

Response Body Success:

```json
{
  "data": {
    "username": "helloworld",
    "name": "Hello World"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Username already exist"]
}
```

## Login User

Endpoint: POST /api/users/login

Request Body:

```json
{
  "username": "helloworld",
  "password": "helloworld123"
}
```

Response Body Success:

```json
{
  "data": {
    "username": "helloworld",
    "name": "Hello World",
    "token": "session id using uuid"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Username or password is wrong"]
}
```

## Get User

Endpoint: GET /api/users/current

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "username": "helloworld",
    "name": "Hello World"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Unauthorized"]
}
```

## Update User

Endpoint: PATCH /api/users/current

Headers:

- Authorization: token

Request Body:

```json
{
  "username": "newhelloworld", // optional
  "password": "newhelloworld123", // optional
  "name": "New Hello World" // optional
}
```

Response Body Success:

```json
{
  "data": {
    "username": "newhelloworld",
    "name": "New Hello World"
  }
}
```

Response Body Error:

```json
{
  "errors": ["Unauthorized", "Username already exist"]
}
```

## Logout User

Endpoint: DELETE /api/users/current

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
  "errors": ["Unauthorized"]
}
```
