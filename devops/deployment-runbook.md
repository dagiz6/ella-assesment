# Deployment Runbook

## 1. Overview

This runbook describes how to build, start, verify, troubleshoot, and roll back the Ella application using Docker Compose.

The application consists of:

* NestJS API
* PostgreSQL database
* Docker Compose for service orchestration

The API is exposed on port `4000`.

The PostgreSQL database is exposed on port `5432`.

---

## 2. Prerequisites

Before deployment, make sure the following are installed:

* Git
* Node.js and npm
* Docker
* Docker Compose

Verify Docker:

```bash
docker --version
docker compose version
```

---

## 3. Get the Application

Clone the repository:

```bash
git clone https://github.com/ellatech-eth/QA-Assessment.git
```

Enter the project directory:

```bash
cd QA-Assessment
```

---

## 4. Configure Environment Variables

Create the environment file:

```bash
cp .env.example .env
```

On Windows, the file can also be created manually by copying `.env.example` to `.env`.

Configure the required values:

```env
PORT=4000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ella
```

When the API runs inside Docker Compose, the `DB_HOST` value is overridden to:

```text
db
```

The `.env` file must not be committed to the repository because it may contain sensitive credentials.

---

## 5. Build and Start the Application

Build the Docker image and start the complete stack:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

Expected services:

```text
shop-api
shop-db
```

The PostgreSQL container should report a healthy status before the API starts.

---

## 6. Verify the Deployment

### 6.1 Check API Health

Send a request to:

```text
GET http://localhost:4000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

A successful response confirms that the NestJS API is running.

### 6.2 Check the Users Endpoint

Test:

```text
GET http://localhost:4000/users
```

Expected result:

```text
HTTP 200 OK
```

This also helps verify that the API can communicate with PostgreSQL.

### 6.3 Check Container Health

Run:

```bash
docker compose ps
```

Both services should be running.

The database should show:

```text
healthy
```

The API should also show:

```text
healthy
```

after the API health check has been configured and the container has finished starting.

---

## 7. View Application Logs

To view API logs:

```bash
docker compose logs api
```

To follow API logs:

```bash
docker compose logs -f api
```

To view database logs:

```bash
docker compose logs db
```

To view logs for the complete stack:

```bash
docker compose logs
```

---

## 8. Common Deployment Problems

### Problem 1: Port 4000 Already in Use

#### Symptom

Docker reports an error similar to:

```text
ports are not available
listen tcp 0.0.0.0:4000: bind
Only one usage of each socket address is normally permitted
```

#### Cause

Another application is already using port `4000`.

During testing, this occurred because the NestJS application was already running locally while Docker was attempting to expose the API on the same port.

#### Diagnosis on Windows

Run:

```bash
netstat -ano | findstr :4000
```

Identify the process using the port.

#### Fix

Stop the locally running NestJS application or stop the process using port `4000`.

Then run:

```bash
docker compose up -d
```

---

### Problem 2: Database Is Not Ready

#### Symptom

The API cannot connect to PostgreSQL when the containers start.

#### Diagnosis

Check:

```bash
docker compose ps
```

Then inspect the database logs:

```bash
docker compose logs db
```

#### Fix

The Compose configuration already uses a PostgreSQL health check and makes the API depend on a healthy database.

Restart the stack if necessary:

```bash
docker compose down
docker compose up -d
```

Then verify:

```bash
docker compose ps
```

---

### Problem 3: API Container Stops

#### Diagnosis

Check the API logs:

```bash
docker compose logs api
```

Also check:

```bash
docker compose ps
```

#### Possible Causes

* Application build failure
* Missing environment variables
* Database connection failure
* Runtime exception
* Incorrect Docker command

#### Fix

Rebuild the image:

```bash
docker compose up -d --build
```

If the problem continues, inspect the API logs for the underlying error.

---

### Problem 4: Docker Build Fails

Run:

```bash
docker compose build --no-cache
```

Then inspect the build output.

Also verify that the application can build locally:

```bash
npm install
npm run build
```

The project should successfully complete the TypeScript/NestJS build before being deployed.

---

## 9. Updating the Application

Pull the latest source code:

```bash
git pull origin main
```

Rebuild and restart the application:

```bash
docker compose up -d --build
```

Verify the deployment:

```bash
docker compose ps
```

Then test:

```text
GET http://localhost:4000/health
```

---

## 10. Rollback Procedure

If a newly deployed version introduces a problem, first stop the current deployment:

```bash
docker compose down
```

Switch to the previously known working Git commit:

```bash
git checkout <previous-working-commit>
```

Rebuild the application:

```bash
docker compose up -d --build
```

Verify the containers:

```bash
docker compose ps
```

Then verify the API:

```text
GET http://localhost:4000/health
```

If the previous version is confirmed to be working, the deployment has been rolled back.

---

## 11. Database Considerations

The PostgreSQL database uses a Docker volume:

```text
db_data
```

This allows database data to persist when the containers are restarted.

Normal restart:

```bash
docker compose down
docker compose up -d
```

Do not remove the Docker volume during a normal deployment.

Avoid:

```bash
docker compose down -v
```

unless intentionally removing the database data is required.

---

## 12. Deployment Checklist

Before considering a deployment successful:

* [ ] Latest source code is available
* [ ] Environment variables are configured
* [ ] Docker image builds successfully
* [ ] PostgreSQL container starts successfully
* [ ] PostgreSQL reports healthy
* [ ] API container starts successfully
* [ ] API health endpoint returns HTTP 200
* [ ] `/users` endpoint returns HTTP 200
* [ ] API logs contain no startup errors
* [ ] Database data is preserved
* [ ] Deployment changes are documented

---

## 13. Recommended Production Improvements

For a production deployment, I would additionally:

1. Use a managed PostgreSQL service instead of running PostgreSQL in the same Docker host.
2. Store secrets in a dedicated secret-management system.
3. Avoid copying `.env` into the Docker image.
4. Use `npm ci` for reproducible dependency installation.
5. Push versioned Docker images to a container registry.
6. Add HTTPS using a reverse proxy or load balancer.
7. Configure centralized application logging.
8. Add monitoring and alerting.
9. Use separate staging and production environments.
10. Require successful CI checks before production deployment.

These improvements would make the deployment more secure, reproducible, and suitable for a production environment.
