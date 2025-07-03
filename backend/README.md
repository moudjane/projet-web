# Backend - Messaging App

Welcome!

This document explains how to install, run, and develop the backend for our messaging application.

---

## Table of Contents

- [Overview](#overview)
- [Installation & Prerequisites](#installation--prerequisites)
- [Running the Project](#running-the-project)
- [Code Architecture](#code-architecture)
- [Main Features](#main-features)
- [Testing](#testing)

---

## Overview

The backend is built with **NestJS** using **Prisma** ORM connected to a local SQLite database.  
It exposes a secure GraphQL API protected by JWT for user, conversation, and message management.  
RabbitMQ is integrated for asynchronous message handling.

---

## Installation & Prerequisites

- Node.js (recommended version 20.x)
- npm
- SQLite installed (database file: `dev.db`)
- RabbitMQ (local or remote, configured via `.env`)
- Environment variables configured in `.env` (see `.env.example`)

### Install dependencies

```bash
npm install
```

---

## Running the Project

### Generate prisma client

After installing dependencies, generate the Prisma client:

```bash
npx prisma generate
```

This step creates the Prisma client code based on your schema, necessary for database operations.

### Locally in development mode

```bash
npm run start:dev
```

The API will be available at http://localhost:4000/graphql.

---

## Code Architecture

- src/auth/ — Authentication logic (signup, login, JWT, guards)
- src/user/ — User management
- src/conversation/ — Conversation management
- src/message/ — Message handling
- src/rabbitmq/ — RabbitMQ connection and publisher
- prisma/ — Prisma schema and migrations

---

## Main Features

- User registration and authentication with JWT
- Creating and retrieving conversations between users
- Sending and fetching messages within conversations
- Publishing messages via RabbitMQ for asynchronous processing
- Securing API endpoints with JWT guards

---

## Testing

Unit tests written with Jest covering core services

Run tests with:

```bash
npm run test
```
