# API Bug Report

## Assessment Context

This document records defects identified during exploratory testing of the Ella API.

**Base URL:** `http://localhost:4000`
**API documentation:** `http://localhost:4000/api`
**OpenAPI JSON:** `http://localhost:4000/api-json`

Testing covered the Users, Products, and Transactions modules, including valid inputs, invalid inputs, missing fields, boundary values, invalid IDs, duplicate data, and type validation.


# Detailed Bugs

## BUG-001: TypeScript compilation error prevents application build

**Module:** Users
**Severity:** High
**Type:** Build / Type Safety
**Endpoint:** Not applicable

### Description

The application fails TypeScript compilation because `users.service.ts` attempts to directly cast an object to the Prisma `User` type using `as User`.

The problematic code is in the user creation flow:

```ts
data: { ...dto, id: 0, transactions: [] } as User
```

TypeScript reports:

```text
TS2352: Conversion of type '{ id: number; transactions: never[]; name: string; email: string; }'
to type 'User' may be a mistake because neither type sufficiently overlaps with the other.
```

This prevents the application from compiling and therefore prevents normal execution of the API.

### Steps to Reproduce

1. Clone the assessment repository.
2. Install dependencies.
3. Run the project build or start command.
4. TypeScript compilation fails in:

```text
src/users/users.service.ts
```

### Actual Result

The application fails to compile because TypeScript rejects the direct `as User` conversion.

### Expected Result

The application should compile successfully without requiring an unsafe type assertion.

### Impact

The defect prevents the application from being built and executed in its original state.

### Temporary Workaround

For testing purposes, the direct cast was temporarily changed to:

```ts
data: { ...dto, id: 0, transactions: [] } as unknown as User
```

This allows testing to continue, but it is not considered a proper production fix because it bypasses TypeScript's type safety.

### Recommended Fix

Return a correctly typed object from the service or correct the underlying data model/type mismatch rather than using an unsafe double cast.

---

## BUG-002: Duplicate email is returned as successful user creation

**Module:** Users
**Severity:** High
**Endpoint:** `POST /users`

### Description

Creating a user with an email that already exists does not return a conflict/error response. Instead, the API returns HTTP `201 Created` and a fake user object with `id: 0`.

### Steps to Reproduce

1. Create a user:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

2. Send the same request again.

### Actual Result

HTTP `201 Created`:

```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "id": 0,
    "transactions": []
  }
}
```

### Expected Result

The API should reject the duplicate email, preferably with:

```text
409 Conflict
```

and a clear message such as:

```text
Email already exists
```

### Impact

Clients receive a false success response and may treat `id: 0` as a newly created user even though no user was created.

---

## BUG-003: Invalid email format is accepted

**Module:** Users
**Severity:** Medium
**Endpoint:** `POST /users`

### Description

The API accepts an invalid email string that does not contain a valid email structure.

### Steps to Reproduce

Send:

```json
{
  "name": "John Doe",
  "email": "johnexamplecom"
}
```

### Actual Result

The API returns `201 Created` and persists the user.

### Expected Result

The request should be rejected with HTTP `400 Bad Request` when an invalid email address is supplied.

### Impact

Invalid user contact data can be stored in the database.

---

## BUG-004: Whitespace-only email is accepted

**Module:** Users
**Severity:** Medium
**Endpoint:** `POST /users`

### Steps to Reproduce

Send:

```json
{
  "name": "John Doe",
  "email": "  "
}
```

### Actual Result

The API returns `201 Created` and persists the user.

### Expected Result

Whitespace-only values should be rejected with HTTP `400 Bad Request`.

### Impact

Invalid/meaningless email data can be stored.

---

## BUG-005: Whitespace-only name is accepted

**Module:** Users
**Severity:** Medium
**Endpoint:** `POST /users`

### Steps to Reproduce

Send a request with a whitespace-only name.

### Actual Result

The API creates the user successfully.

### Expected Result

A name containing only whitespace should be rejected with HTTP `400 Bad Request`.

### Impact

Invalid user names can be persisted.

---

## BUG-006: Non-numeric user ID causes HTTP 500 on GET

**Module:** Users
**Severity:** Medium
**Endpoint:** `GET /users/{id}`

### Steps to Reproduce

Send:

```text
GET /users/abc
```

### Actual Result

HTTP `500 Internal Server Error`.

The error indicates:

```text
invalid input syntax for type integer: "NaN"
```

### Expected Result

An invalid path parameter should be rejected as a client input error, preferably:

```text
400 Bad Request
```

### Impact

Malformed client input causes an internal server error instead of a controlled validation response.

---

## BUG-007: Non-numeric user ID causes HTTP 500 on PUT

**Module:** Users
**Severity:** Medium
**Endpoint:** `PUT /users/{id}`

### Steps to Reproduce

Send an update request using:

```text
PUT /users/abc
```

### Actual Result

HTTP `500 Internal Server Error` with an integer parsing error.

### Expected Result

The API should return HTTP `400 Bad Request` for a non-numeric ID.

### Impact

Invalid client input reaches the database/service layer and produces an internal error.

---

## BUG-008: Empty PUT request overwrites user fields with blank values

**Module:** Users
**Severity:** High
**Endpoint:** `PUT /users/{id}`

### Steps to Reproduce

1. Create or retrieve an existing user.
2. Send:

```json
{}
```

to:

```text
PUT /users/1
```

### Actual Result

The API returns `200 OK` and the user's fields are changed to blank/space values.

### Expected Result

An empty update request should be rejected with HTTP `400 Bad Request`.

### Impact

A client can unintentionally destroy valid user data by submitting an empty update payload.

---

## BUG-009: Invalid email format is accepted during user update

**Module:** Users
**Severity:** Medium
**Endpoint:** `PUT /users/{id}`

### Steps to Reproduce

Update an existing user using an invalid email value such as:

```json
{
  "name": "John Updated",
  "email": "invalidemail"
}
```

### Actual Result

The API returns `200 OK` and accepts the invalid email.

### Expected Result

Invalid email format should return HTTP `400 Bad Request`.

### Impact

Invalid user data can be introduced through the update endpoint even if existing records were valid.

---

# Products

## BUG-010: Negative product price is accepted

**Module:** Products
**Severity:** Medium
**Endpoint:** `POST /products`

### Steps to Reproduce

Send a product with a negative price:

```json
{
  "name": "Test Product",
  "price": -10,
  "quantity": 5
}
```

### Actual Result

The API returns `201 Created`.

### Expected Result

A negative price should be rejected with HTTP `400 Bad Request`.

### Impact

Invalid financial data can be stored.

---

## BUG-011: Whitespace-only product name is accepted

**Module:** Products
**Severity:** Medium
**Endpoint:** `POST /products`

### Steps to Reproduce

Send:

```json
{
  "name": "   ",
  "price": 10,
  "quantity": 5
}
```

### Actual Result

The API returns `201 Created`.

### Expected Result

A whitespace-only product name should be rejected with HTTP `400 Bad Request`.

### Impact

Products with invalid names can be created.

---

## BUG-012: Non-numeric product ID causes HTTP 500 on GET

**Module:** Products
**Severity:** Medium
**Endpoint:** `GET /products/{id}`

### Steps to Reproduce

Send:

```text
GET /products/abc
```

### Actual Result

HTTP `500 Internal Server Error`.

### Expected Result

HTTP `400 Bad Request` for an invalid ID.

### Impact

Invalid client input produces an internal server error.

---

## BUG-013: Non-numeric product ID causes HTTP 500 on PUT

**Module:** Products
**Severity:** Medium
**Endpoint:** `PUT /products/{id}`

### Steps to Reproduce

Send:

```text
PUT /products/abc
```

with a valid product body.

### Actual Result

HTTP `500 Internal Server Error`.

### Expected Result

HTTP `400 Bad Request`.

### Impact

Malformed IDs are not handled at the API validation layer.

---

## BUG-014: Whitespace-only product name is accepted during update

**Module:** Products
**Severity:** Medium
**Endpoint:** `PUT /products/{id}`

### Steps to Reproduce

Update an existing product using:

```json
{
  "name": "   ",
  "price": 10,
  "quantity": 5
}
```

### Actual Result

The API returns `200 OK`.

### Expected Result

The API should reject a whitespace-only name with HTTP `400 Bad Request`.

### Impact

Invalid product data can be introduced through updates.

---

## BUG-015: Negative product price is accepted during update

**Module:** Products
**Severity:** Medium
**Endpoint:** `PUT /products/{id}`

### Steps to Reproduce

Send an update with:

```json
{
  "name": "Test Product",
  "price": -10,
  "quantity": 5
}
```

### Actual Result

HTTP `200 OK`.

### Expected Result

HTTP `400 Bad Request`.

### Impact

Existing products can be updated with invalid financial values.

---

## BUG-016: Decimal product quantity causes HTTP 500 on update

**Module:** Products
**Severity:** High
**Endpoint:** `PUT /products/{id}`

### Steps to Reproduce

Update a product using a decimal quantity:

```json
{
  "name": "Test Product",
  "price": 10,
  "quantity": 2.5
}
```

### Actual Result

HTTP `500 Internal Server Error`.

### Expected Result

The API should reject a non-integer quantity with HTTP `400 Bad Request`.

### Impact

Invalid input reaches the persistence layer and causes an internal server error.

### Recommended Fix

Validate product quantity as an integer before attempting database persistence.

---

# Transactions

## BUG-017: Non-numeric transaction ID causes HTTP 500 on GET

**Module:** Transactions
**Severity:** Medium
**Endpoint:** `GET /transactions/{id}`

### Steps to Reproduce

Send:

```text
GET /transactions/abc
```

### Actual Result

HTTP `500 Internal Server Error`.

The database reports an integer parsing error involving `NaN`.

### Expected Result

The API should reject the invalid ID with HTTP `400 Bad Request`.

### Impact

Malformed client input causes an internal server error instead of a validation response.

---

# Notes on Tested Behaviors That Passed

The following important validation/error scenarios were tested and did not produce defects:

### Users

* Valid user creation
* Missing required fields
* Existing user lookup
* Nonexistent user lookup
* Zero/negative numeric IDs returning `404`
* Valid user update
* Updating a nonexistent user
* Duplicate email during update returning `409 Conflict`

### Products

* Valid product creation
* `FOR_SALE` status
* Quantity `0`
* Missing required fields
* Empty request body
* String price rejection
* Negative quantity rejection
* String quantity rejection
* Invalid status rejection
* Lowercase status rejection
* Existing/nonexistent product lookup
* Valid product update
* Negative quantity rejection during update
* Invalid status rejection
* Empty update body rejection

### Transactions

* Valid transaction creation
* Missing required fields
* Empty request body
* Nonexistent user/product rejection
* Zero and negative IDs
* Non-numeric user/product IDs
* Zero/negative quantity
* Non-numeric quantity
* Decimal quantity
* Quantity greater than available stock
* Very large quantity exceeding available stock
* Transaction list retrieval
* Existing transaction retrieval
* Nonexistent transaction ID
* Zero/negative transaction IDs

---

# Severity Definitions

| Severity | Meaning                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Prevents the application from building, causes data corruption/data loss, produces false success, or causes a significant server-side failure |
| Medium   | Causes incorrect validation, allows invalid data, or produces an inappropriate server error                                                   |
| Low      | Minor functional, usability, or non-critical issue                                                                                            |

---

# Overall QA Assessment

The API successfully handles many standard validation and business-rule scenarios, particularly around required fields, resource existence, transaction stock validation, and several numeric constraints.

However, several validation gaps remain. The most significant findings are:

1. The original application does not compile because of a TypeScript type error.
2. Duplicate user creation can return a false `201 Created` response with a fake `id: 0`.
3. Several endpoints accept invalid or whitespace-only data.
4. Invalid path IDs frequently result in `500 Internal Server Error` instead of a client-side `400 Bad Request`.
5. Product price validation does not prevent negative values.
6. Decimal product quantities can reach the database and produce a `500` error.

These issues should be addressed before considering the API production-ready.
