# Users Module Manual Test Cases

## 1. Test Case Overview

**Module:** Users
**Base URL:** `http://localhost:4000`
**Test Type:** Manual API Testing
**Testing Tool:** Postman
**Environment:** Local development environment

### Scope

The Users module was tested for:

* User creation
* Required-field validation
* Email validation
* Duplicate email handling
* Whitespace input
* User retrieval
* Invalid user IDs
* User updates
* Duplicate email during update
* Invalid update data
* Empty update requests

The test cases include positive, negative, and edge-case scenarios.

---

## 2. Test Data

### Valid User

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Valid Updated User

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

---

# 3. Manual Test Cases

## TC-USR-001: Create user with valid data

**Endpoint:** `POST /users`

### Test Data

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Provide a valid name and email.
3. Submit the request.

### Expected Result

* HTTP status `201 Created`.
* A new user is created.
* Response contains the user's ID, name, email, and timestamps.
* Success message indicates that the user was created successfully.

### Actual Result

HTTP `201 Created` and a valid user was created.

### Status

**PASS**

---

## TC-USR-002: Create user without name

**Endpoint:** `POST /users`

### Test Data

```json
{
  "email": "noname@example.com"
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Omit the `name` field.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* Validation error indicates that the name is required.
* No user should be created.

### Actual Result

HTTP `400 Bad Request`.

### Status

**PASS**

---

## TC-USR-003: Create user without email

**Endpoint:** `POST /users`

### Test Data

```json
{
  "name": "John Doe"
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Omit the `email` field.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* Validation error indicates that the email is required.
* No user should be created.

### Actual Result

HTTP `400 Bad Request` with:

```text
Email is required
```

### Status

**PASS**

---

## TC-USR-004: Create user with empty request body

**Endpoint:** `POST /users`

### Test Data

```json
{}
```

### Steps

1. Send a `POST` request to `/users`.
2. Use an empty JSON object as the request body.

### Expected Result

* HTTP `400 Bad Request`.
* Required-field validation errors should be returned.
* No user should be created.

### Actual Result

HTTP `400 Bad Request`.

### Status

**PASS**

---

## TC-USR-005: Create user with invalid email format

**Endpoint:** `POST /users`

### Test Data

```json
{
  "name": "John Doe",
  "email": "johnexamplecom"
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Provide an incorrectly formatted email.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* The invalid email should be rejected.
* No user should be created.

### Actual Result

HTTP `201 Created` and the invalid email was persisted.

### Status

**FAIL**

### Related Bug

`BUG-003`

---

## TC-USR-006: Create user with whitespace-only email

**Endpoint:** `POST /users`

### Test Data

```json
{
  "name": "John Doe",
  "email": "  "
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Provide an email containing only whitespace.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* Whitespace-only email should be rejected.
* No user should be created.

### Actual Result

HTTP `201 Created` and the whitespace-only email was persisted.

### Status

**FAIL**

### Related Bug

`BUG-004`

---

## TC-USR-007: Create user with whitespace-only name

**Endpoint:** `POST /users`

### Test Data

```json
{
  "name": "   ",
  "email": "whitespace@example.com"
}
```

### Steps

1. Send a `POST` request to `/users`.
2. Provide a name containing only whitespace.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* Whitespace-only name should be rejected.
* No user should be created.

### Actual Result

HTTP `201 Created` and the user was created.

### Status

**FAIL**

### Related Bug

`BUG-005`

---

## TC-USR-008: Create duplicate user using an existing email

**Endpoint:** `POST /users`

### Preconditions

A user already exists with:

```text
john@example.com
```

### Test Data

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Steps

1. Create a user with the email.
2. Submit another request using the same email.
3. Observe the response.

### Expected Result

* HTTP `409 Conflict`.
* API should indicate that the email already exists.
* No duplicate user should be created.

### Actual Result

HTTP `201 Created`.

The response contained:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "id": 0,
  "transactions": []
}
```

### Status

**FAIL**

### Related Bug

`BUG-002`

---

# User Retrieval

## TC-USR-009: Retrieve an existing user

**Endpoint:** `GET /users/{id}`

### Preconditions

A user with ID `1` exists.

### Steps

1. Send `GET /users/1`.
2. Observe the response.

### Expected Result

* HTTP `200 OK`.
* Correct user information is returned.
* Returned ID matches the requested ID.

### Actual Result

HTTP `200 OK` with the correct user.

### Status

**PASS**

---

## TC-USR-010: Retrieve a nonexistent user

**Endpoint:** `GET /users/{id}`

### Test Data

```text
/users/999999
```

### Steps

1. Send `GET /users/999999`.
2. Observe the response.

### Expected Result

* HTTP `404 Not Found`.
* Response clearly indicates that the user does not exist.

### Actual Result

HTTP `404 Not Found`:

```text
User with ID 999999 not found
```

### Status

**PASS**

---

## TC-USR-011: Retrieve user using ID zero

**Endpoint:** `GET /users/{id}`

### Test Data

```text
/users/0
```

### Steps

1. Send `GET /users/0`.
2. Observe the response.

### Expected Result

* HTTP `404 Not Found` if no user with ID `0` exists.
* API should not return a server error.

### Actual Result

HTTP `404 Not Found`.

### Status

**PASS**

---

## TC-USR-012: Retrieve user using a negative ID

**Endpoint:** `GET /users/{id}`

### Test Data

```text
/users/-1
```

### Steps

1. Send `GET /users/-1`.
2. Observe the response.

### Expected Result

* HTTP `404 Not Found` if the user does not exist.
* API should not return an internal server error.

### Actual Result

HTTP `404 Not Found`.

### Status

**PASS**

---

## TC-USR-013: Retrieve user using a non-numeric ID

**Endpoint:** `GET /users/{id}`

### Test Data

```text
/users/abc
```

### Steps

1. Send `GET /users/abc`.
2. Observe the response.

### Expected Result

* HTTP `400 Bad Request`.
* API should identify that the ID must be numeric.
* The request should not reach the database as an invalid integer.

### Actual Result

HTTP `500 Internal Server Error`.

Error:

```text
invalid input syntax for type integer: "NaN"
```

### Status

**FAIL**

### Related Bug

`BUG-006`

---

# User Update

## TC-USR-014: Update an existing user with valid data

**Endpoint:** `PUT /users/{id}`

### Test Data

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

### Steps

1. Identify an existing user.
2. Send `PUT /users/1`.
3. Provide valid updated name and email.
4. Submit the request.

### Expected Result

* HTTP `200 OK`.
* User information is updated.
* `updatedAt` is changed.
* User ID remains unchanged.

### Actual Result

HTTP `200 OK` and the user was updated successfully.

### Status

**PASS**

---

## TC-USR-015: Update a nonexistent user

**Endpoint:** `PUT /users/{id}`

### Test Data

```text
/users/99999
```

Request body:

```json
{
  "name": "Test User",
  "email": "testuser@example.com"
}
```

### Steps

1. Send `PUT /users/99999`.
2. Provide valid update data.
3. Submit the request.

### Expected Result

* HTTP `404 Not Found`.
* No user should be created or updated.

### Actual Result

HTTP `404 Not Found`.

```text
User with ID 99999 not found
```

### Status

**PASS**

---

## TC-USR-016: Update user using a non-numeric ID

**Endpoint:** `PUT /users/{id}`

### Test Data

```text
/users/abc
```

Request body:

```json
{
  "name": "Test User",
  "email": "testuser@example.com"
}
```

### Steps

1. Send `PUT /users/abc`.
2. Provide otherwise valid update data.
3. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* API should reject the invalid ID before database processing.

### Actual Result

HTTP `500 Internal Server Error`.

Error:

```text
invalid input syntax for type integer: "NaN"
```

### Status

**FAIL**

### Related Bug

`BUG-007`

---

## TC-USR-017: Update user with duplicate email

**Endpoint:** `PUT /users/{id}`

### Preconditions

* User `1` has email `johnupdated@example.com`.
* Another user exists with a different ID.

### Test Data

```json
{
  "name": "Duplicate Email Test",
  "email": "johnupdated@example.com"
}
```

### Steps

1. Attempt to update another user.
2. Use the email already assigned to user `1`.
3. Submit the request.

### Expected Result

* HTTP `409 Conflict`.
* API should reject the duplicate email.
* Existing users should remain unchanged.

### Actual Result

HTTP `409 Conflict`:

```text
Email already exists
```

### Status

**PASS**

---

## TC-USR-018: Update user with an empty body

**Endpoint:** `PUT /users/{id}`

### Test Data

```json
{}
```

### Steps

1. Select an existing user.
2. Send `PUT /users/1`.
3. Provide an empty JSON object.
4. Observe the response and persisted user data.

### Expected Result

* HTTP `400 Bad Request`.
* Existing user information should remain unchanged.
* Required user fields should not be replaced with blank values.

### Actual Result

HTTP `200 OK`.

The user's `name` and `email` were changed to blank/whitespace values.

### Status

**FAIL**

### Related Bug

`BUG-008`

---

## TC-USR-019: Update user with invalid email format

**Endpoint:** `PUT /users/{id}`

### Test Data

```json
{
  "name": "John Updated",
  "email": "invalidemail"
}
```

### Steps

1. Select an existing user.
2. Send a `PUT` request.
3. Provide an invalid email format.
4. Submit the request.

### Expected Result

* HTTP `400 Bad Request`.
* Invalid email should not be persisted.
* Existing valid email should remain unchanged.

### Actual Result

HTTP `200 OK` and the invalid email was accepted.

### Status

**FAIL**

### Related Bug

`BUG-009`

---

## TC-USR-020: Update user with whitespace-only name and email

**Endpoint:** `PUT /users/{id}`

### Test Data

```json
{
  "name": "   ",
  "email": "   "
}
```

### Steps

1. Select an existing user.
2. Send a `PUT` request with whitespace-only values.
3. Submit the request.
4. Check the response and persisted user.

### Expected Result

* HTTP `400 Bad Request`.
* Whitespace-only name and email should be rejected.
* Existing user data should remain unchanged.

### Actual Result

The API accepts whitespace-only values during user updates.

### Status

**FAIL**

### Related Bugs

`BUG-004` / `BUG-005` validation behavior is also applicable to update handling.

---

# 4. Test Execution Summary

| Category       |  Total |   Pass |  Fail |
| -------------- | -----: | -----: | ----: |
| User Creation  |      8 |      4 |     4 |
| User Retrieval |      5 |      4 |     1 |
| User Update    |      7 |      3 |     4 |
| **Total**      | **20** | **11** | **9** |

**Pass Rate:** 55%
**Fail Rate:** 45%

---

# 5. Key Findings

The Users module successfully handles several basic scenarios, including:

* Valid user creation
* Required-field validation
* Existing user retrieval
* Nonexistent user handling
* Valid user updates
* Nonexistent user updates
* Duplicate email detection during updates

However, the testing identified significant validation and error-handling weaknesses:

1. Duplicate user creation returns a false success response.
2. Invalid email formats are accepted.
3. Whitespace-only names and emails are accepted.
4. Non-numeric user IDs cause HTTP 500 errors.
5. Empty update requests can overwrite user data with blank values.
6. Invalid email values can be introduced through updates.

These issues should be addressed before the Users module is considered production-ready.
