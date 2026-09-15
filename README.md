# EllaTech QA & DevOps Assessment

## Overview

This repository contains my completed QA and DevOps assessment for the Ella application.

The work is organized into two main sections:

* `/qa` contains API testing, bug documentation, manual test cases, Postman testing, and performance testing.
* `/devops` contains CI, environment configuration, deployment, Docker review, and deployment planning documentation.

The submission focuses on identifying application issues, validating existing functionality, and documenting practical DevOps processes.

---

## Submission Structure

```text
.
├── qa/
│   ├── BUGS.md
│   ├── test-cases.md 
│   ├── postman-collection.json
│   ├── k6-script.js
|   |__ k6-result.json
│
├── devops/
│   ├── ci-notes.md
│   ├── environment-notes.md
│   ├── deployment-runbook.md
│   ├── docker-notes.md
│   └── cloud-deployment-plan.md
│
└── README-SUBMISSION.md
```

---

# QA

## Bug Documentation

[`qa/BUGS.md`](qa/BUGS.md)

Contains bugs identified through exploratory API testing, including:

* Input validation issues
* Duplicate email handling
* Invalid ID handling
* Invalid email handling
* Invalid product values
* Invalid transaction values
* Build/type issues

Each documented bug includes the observed behavior and relevant details.

## Manual Test Cases

[`qa/test-cases.md`](qa/test-cases.md)

Contains manual test cases for the Users module.

The test cases cover:

* Positive scenarios
* Negative scenarios
* Edge cases
* User creation
* User retrieval
* User updates

## Postman Collection

[`qa/postman-collection.json`](qa/postman-collection.json)

Contains API requests and automated assertions for:

* Users
* Products
* Transactions

The collection can be imported into Postman for API validation.

## Performance Testing

[`qa/k6-script.js`](qa/k6-script.js)

Contains the k6 performance test script.

The test was executed against the Users API.

Observed results included:

* HTTP request failure rate: `0%`
* p95 response time: approximately `9 ms`
* 307 HTTP requests
* Maximum of 10 virtual users

---

# DevOps

## CI Notes

[`devops/ci-notes.md`](devops/ci-notes.md)

Documents the GitHub Actions CI workflow.

The workflow performs:

```text
Install dependencies
        ↓
      Lint
        ↓
      Build
        ↓
   Unit tests
```

It runs on pushes and pull requests.

## Environment Notes

[`devops/environment-notes.md`](devops/environment-notes.md)

Documents:

* Required environment variables
* Development configuration
* Staging configuration recommendations
* Testing configuration recommendations
* Production configuration recommendations
* Secret management considerations
* Docker environment differences

## Deployment Runbook

[`devops/deployment-runbook.md`](devops/deployment-runbook.md)

Documents the deployment and operational process, including:

* Starting the application
* Docker deployment
* Deployment verification
* Health checks
* Log inspection
* Common deployment problems
* Troubleshooting
* Rollback procedures

## Docker Notes

[`devops/docker-notes.md`](devops/docker-notes.md)

Contains the Docker and Docker Compose review.

It documents:

* Docker build and startup testing
* Docker Compose behavior
* Database health checks
* API startup
* Port conflict encountered during testing
* Diagnosis and resolution
* Recommended Docker improvements

## Cloud Deployment Plan

[`devops/cloud-deployment-plan.md`](devops/cloud-deployment-plan.md)

Contains a proposed AWS deployment architecture using:

* Amazon ECR
* Amazon ECS / Fargate
* Amazon RDS PostgreSQL
* Application Load Balancer
* AWS Secrets Manager
* Amazon CloudWatch

This is a proposed deployment plan and does not claim that the application was deployed to AWS.

---

# Validation Summary

The following validation was performed during the assessment:

| Area                      | Result     |
| ------------------------- | ---------- |
| Lint                      | PASS       |
| Build                     | PASS       |
| Unit tests                | 12/12 PASS |
| Docker Compose build      | PASS       |
| PostgreSQL container      | Healthy    |
| API container             | Running    |
| Health endpoint           | HTTP 200   |
| Users API                 | HTTP 200   |
| k6 performance test       | PASS       |
| HTTP request failure rate | 0%         |

---

# Unit Test Result

The Users service unit tests were executed successfully:

```text
Test Suites: 1 passed
Tests: 12 passed
```

---

# Docker Verification

The application was tested using:

```bash
docker compose up -d --build
```

The Docker Compose stack successfully started the PostgreSQL database and API service.

The API was verified through:

```text
GET /health
GET /users
```

Both endpoints returned successful responses during verification.

---

# Notes

The QA section documents observed application behavior and identified defects.

The purpose of the testing was to identify and report issues rather than silently change the application's behavior.

The DevOps section documents the implemented CI/Docker work and provides environment, deployment, and cloud deployment guidance.

All assessment-related work is contained within this repository.
