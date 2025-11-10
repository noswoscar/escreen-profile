# Small Microservice for Pret-allez.com

This repository provides a minimal example microservice for **Pret-allez.com**, built using **TypeScript** and follows **Domain-Driven Design (DDD)** principles. It is designed to be extendable and scalable as part of the larger Pret-allez ecosystem. The project prioritizes simplicity, clear architecture, and flexibility.

## Features

### 1. Minimal `tsconfig.json`

The service utilizes a minimal `tsconfig.json` configuration for efficient TypeScript compilation, focusing on the essentials for microservices. The goal is to keep the build process clean and optimized.

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. Minimal Set of Dependencies in `package.json`

Only essential dependencies are included, reducing bloat and improving performance. It leverages **pnpm** for fast and efficient package management.

```json
{
  "dependencies": {
    "dotenv": "16.4.5",
    "express": "4.19.2",
    "joi": "17.13.3",
    "mongoose": "8.5.3",
    "winston": "3.14.1",
    "winston-mongodb": "5.1.1"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "22.3.0",
    "ts-node": "10.9.2",
    "ts-node-dev": "2.0.0",
    "typescript": "5.5.4"
  }
}
```

### 3. Custom Logger with Custom Pret-allez Transports

A custom logger is integrated using **Winston** and designed to align with the Pret-allez ecosystem. The logger supports structured logging with multiple transports, ensuring that logs are properly formatted and routed.

### 4. `.gitignore` File Included

A pre-configured `.gitignore` ensures that unnecessary files (such as build artifacts and sensitive data) are excluded from version control.

### 5. Domain-Driven Design (DDD) Architecture

The microservice follows **Domain-Driven Design** principles, organizing code around business domains to ensure scalability and maintainability. The project is structured into distinct layers, including **Application**, **Domain**, and **Infrastructure**.

### 6. MongoDB Connection and Mongoose Models

The service is connected to a **MongoDB** database, and it uses **Mongoose** for schema-based data modeling and interaction with MongoDB. This provides a robust and flexible way to manage database operations within the service.

### 7. API Endpoints

- **Create Entity** (`POST /api/entity`): Create a new entity.
- **Delete Entity** (`DELETE /api/entity/:id`): Delete a specific entity by its ID.

### 8. Tests

The tests dir contains manual tests which are individual scripts for entities and contain example curl test commands
eg: Entity.sh

## Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone git@github.com:noswoscar/small-microservice.git
cd small-microservice
```
