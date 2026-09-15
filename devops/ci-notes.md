# CI Notes

## 1. Overview

The project uses GitHub Actions for continuous integration.

The CI workflow is triggered on:

* Pushes to the repository
* Pull requests

The workflow validates the application by:

1. Installing dependencies
2. Running the linter
3. Building the NestJS application
4. Running the unit tests

The workflow is located at:

```text
.github/workflows/ci.yml
```

---

## 2. CI Workflow

The current workflow is:

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  ci:
    name: Lint, Build and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build project
        run: npm run build

      - name: Run unit tests
        run: npm test
```

---

## 3. Pipeline Stages

### 3.1 Checkout

The workflow first checks out the repository using:

```yaml
uses: actions/checkout@v4
```

This makes the project source code available to the GitHub Actions runner.

### 3.2 Node.js Setup

The workflow uses Node.js 22:

```yaml
node-version: 22
```

npm dependency caching is also enabled through `actions/setup-node`.

### 3.3 Dependency Installation

Dependencies are installed using:

```bash
npm ci
```

`npm ci` is used in CI because it installs dependencies based on the lockfile and provides a more reproducible installation than a normal `npm install`.

### 3.4 Linting

The workflow runs:

```bash
npm run lint
```

This checks the TypeScript source code for linting problems.

If the command fails, the CI job fails.

### 3.5 Build

The application is compiled using:

```bash
npm run build
```

This verifies that the NestJS application can successfully compile.

A build failure causes the CI workflow to fail.

### 3.6 Unit Tests

The workflow runs:

```bash
npm test
```

This executes the project's Jest unit tests.

A failing test causes the CI workflow to fail.

---

## 4. Local CI Verification

Before relying on the GitHub Actions workflow, the same important commands were executed locally.

### Lint

```bash
npm run lint
```

Result:

```text
PASS
```

### Build

```bash
npm run build
```

Result:

```text
PASS
```

### Unit Tests

```bash
npm test
```

Result:

```text
Test Suites: 1 passed
Tests: 12 passed
```

Therefore, the project successfully passed the local CI validation sequence.

---

## 5. Failure Behavior

The CI workflow is intentionally sequential.

If dependency installation fails, later steps are not executed.

If linting fails:

```bash
npm run lint
```

fails, the workflow stops.

If the application cannot compile:

```bash
npm run build
```

fails, the workflow stops.

If a unit test fails:

```bash
npm test
```

fails, the workflow stops.

This prevents a change from being considered successfully validated when one of the required quality checks has failed.

---

## 6. CI Requirements

The workflow covers the main continuous integration requirements:

| Requirement             | Implementation                        |
| ----------------------- | ------------------------------------- |
| Trigger on push         | GitHub Actions `push` trigger         |
| Trigger on pull request | GitHub Actions `pull_request` trigger |
| Install dependencies    | `npm ci`                              |
| Lint                    | `npm run lint`                        |
| Build                   | `npm run build`                       |
| Unit tests              | `npm test`                            |
| Fail on errors          | GitHub Actions step failure behavior  |

---

## 7. Continuous Deployment Extension

The current workflow provides continuous integration only.

It can be extended toward continuous deployment by adding a deployment job that runs only after the CI job succeeds.

A future deployment pipeline could follow this structure:

```text
Push / Pull Request
        |
        v
   Install Dependencies
        |
        v
      Lint
        |
        v
      Build
        |
        v
   Unit Tests
        |
        v
  Build Docker Image
        |
        v
 Push Image to Registry
        |
        v
 Deploy to Staging
        |
        v
   Health Check
        |
        v
 Deploy to Production
```

Production deployment should be protected using GitHub environments, deployment secrets, and an approval process where appropriate.

---

## 8. Recommended Future Improvements

For a more complete production CI/CD pipeline, the following improvements could be added:

* Add end-to-end tests to the CI workflow.
* Add Docker image building to CI.
* Scan Docker images for vulnerabilities.
* Push versioned Docker images to a container registry.
* Add a staging deployment after successful CI.
* Run API health checks after deployment.
* Add a protected production deployment environment.
* Add deployment notifications.
* Cache dependencies to reduce workflow execution time.
* Add test coverage reporting.

These are proposed improvements and are not part of the current workflow.

---

## 9. Summary

The implemented GitHub Actions workflow provides automated validation for every push and pull request.

The pipeline installs dependencies, runs linting, builds the NestJS application, and executes the Jest unit tests.

Local verification confirmed that the current project passes:

```text
Lint       PASS
Build      PASS
Unit Tests PASS - 12/12
```

The workflow therefore provides a basic but functional CI pipeline that can be extended with Docker image publishing, staging deployment, health checks, and protected production deployment.
