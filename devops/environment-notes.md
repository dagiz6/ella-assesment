# Environment Notes

## 1. Overview

The application uses environment variables for application and PostgreSQL database configuration.

The main variables currently defined by the project are:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ella
```

The project provides an `.env.example` file that can be copied to `.env` for local development.

---

## 2. Environment Variables

| Variable      | Purpose                     | Example     | Required |
| ------------- | --------------------------- | ----------- | -------- |
| `PORT`        | Port used by the NestJS API | `4000`      | Yes      |
| `DB_HOST`     | PostgreSQL hostname         | `localhost` | Yes      |
| `DB_PORT`     | PostgreSQL port             | `5432`      | Yes      |
| `DB_USERNAME` | PostgreSQL username         | `postgres`  | Yes      |
| `DB_PASSWORD` | PostgreSQL password         | `postgres`  | Yes      |
| `DB_DATABASE` | PostgreSQL database name    | `ella`      | Yes      |

The example values are for local development only and should not be reused as production credentials.

---

## 3. Development Environment

For local development, create the environment file from the example:

```bash
cp .env.example .env
```

The local configuration can use:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ella
```

When PostgreSQL is running through Docker Compose and the NestJS application is running directly on the host machine, `DB_HOST=localhost` is used.

The API can then be started with:

```bash
npm run start:dev
```

---

## 4. Docker Environment

When the NestJS API runs inside Docker Compose, the database hostname must refer to the Compose service name.

The Docker Compose configuration overrides:

```env
DB_HOST=db
```

Therefore, the API container connects to PostgreSQL using:

```text
db:5432
```

rather than:

```text
localhost:5432
```

This is because `localhost` inside the API container refers to the API container itself.

The full Docker stack can be started with:

```bash
docker compose up -d --build
```

---

## 5. Staging Environment

The repository does not currently provide separate staging configuration values.

For a staging deployment, I would create a separate environment configuration with:

```env
PORT=4000

DB_HOST=<staging-database-host>
DB_PORT=5432
DB_USERNAME=<staging-database-user>
DB_PASSWORD=<staging-database-password>
DB_DATABASE=<staging-database-name>
```

Staging should use a separate database from development and production.

The actual credentials should be provided through the deployment platform's environment-variable or secret-management system rather than committed to Git.

---

## 6. Test Environment

The repository does not currently define a separate test environment configuration.

For automated testing, a separate test database should be used where database integration tests require persistent data.

A test configuration could follow the same variable structure:

```env
PORT=4000

DB_HOST=<test-database-host>
DB_PORT=5432
DB_USERNAME=<test-database-user>
DB_PASSWORD=<test-database-password>
DB_DATABASE=<test-database-name>
```

Test credentials and database information should not be committed to the repository.

The existing unit tests for the Users service use mocked repository behavior and therefore do not require a production database connection.

---

## 7. Production Environment

Production should use separate credentials and infrastructure from development.

A production configuration would follow this structure:

```env
PORT=4000

DB_HOST=<production-database-host>
DB_PORT=5432
DB_USERNAME=<production-database-user>
DB_PASSWORD=<production-database-password>
DB_DATABASE=<production-database-name>
```

Production values are placeholders here because the repository does not provide actual production infrastructure or credentials.

Production secrets should be stored using the deployment platform's secret-management mechanism.

---

## 8. Secret Management

The `.env` file should not be committed to Git.

The repository should contain:

```text
.env.example
```

but not the actual:

```text
.env
```

The `.env.example` file should contain safe example values and document the required variables without exposing real credentials.

For production, secrets should preferably be managed by a dedicated secret-management service or the cloud provider's protected environment variables.

---

## 9. Environment Separation

The recommended configuration is:

```text
Development
    |
    +-- Local application
    +-- Development PostgreSQL

Staging
    |
    +-- Staging application
    +-- Staging PostgreSQL

Production
    |
    +-- Production application
    +-- Production PostgreSQL
```

Each environment should have its own database and credentials to prevent accidental modification of production data during development or testing.

---

## 10. Environment Checklist

Before starting the application, verify:

* [ ] `.env` exists locally
* [ ] `PORT` is configured
* [ ] `DB_HOST` is correct for the execution environment
* [ ] `DB_PORT` is reachable
* [ ] Database username is correct
* [ ] Database password is correct
* [ ] Database name exists
* [ ] Production credentials are not committed to Git
* [ ] Staging and production use separate databases
* [ ] `.env.example` remains safe to commit

## 11. Important Docker Note

The value of `DB_HOST` depends on where the API is running.

| API Location      | PostgreSQL Location                     | `DB_HOST`                    |
| ----------------- | --------------------------------------- | ---------------------------- |
| Local machine     | Local/Docker PostgreSQL exposed to host | `localhost`                  |
| Docker container  | Docker Compose PostgreSQL               | `db`                         |
| Staging server    | Staging database                        | `<staging-database-host>`    |
| Production server | Production database                     | `<production-database-host>` |

This distinction is important because Docker containers have their own network namespace and cannot use `localhost` to reach another Compose service.
