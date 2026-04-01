# Finance Data Processing and Access Control Backend

> Backend assessment project demonstrating scalable API design, role-based access control, and financial data processing.

## Objective
To design and implement a scalable backend system for managing financial records with role-based access control, data validation, and analytical dashboard summaries.

**📖 Live API Documentation:** [View Documentation on Postman](https://documenter.getpostman.com/view/43148200/2sBXiok9Qd)


A comprehensive, production-ready backend assessment implementation for a financial dashboard system. This system efficiently handles user role management, secure financial records storage, and rapid analytical dashboard outputs.

## Tech Stack Overview

- **Language:** TypeScript 
- **Environment:** Node.js
- **Framework:** Express.js
- **Database & ORM:** SQLite + Prisma ORM
- **Validation:** Zod
- **Security:** Helmet, Express Rate Limiter, JSON Web Tokens (JWT)

## Project Structure
```text
src/
 ├── controllers/
 ├── services/
 ├── routes/
 ├── middlewares/
 ├── validators/
 ├── config/
 ├── utils/
 └── app.ts
prisma/
 └── schema.prisma
```

## Assumptions
- Only ADMIN users can modify financial records.
- ANALYST users have read-only access to records and summaries.
- VIEWER users can only access dashboard summaries.
- Soft deletes (`deletedAt`) are used instead of permanent SQL row deletion to preserve data integrity.

## Core Features & Unique Enhancements

This project completely fulfills all outlined requirements including roles, dynamic CRUD, access-control logic, and data summaries. To demonstrate advanced backend concepts, several **unique additions** were developed:

### 1. The Audit Log Tracker
Whenever a user modifies a crucial piece of financial data, an Audit Log is generated. This allows the firm/business to track exactly which `ADMIN` adjusted, created, or deleted a particular financial entry and ensures high accountability. 

### 2. Universal Soft Deletes
Data loss in a financial system is catastrophic. When a user requests to delete a resource, the API leverages a "Soft Delete" mechanism (sets a `deletedAt` timestamp). Active queries filter these out, while preserving data integrity historically.

### 3. Bulletproof Request Validation
Using `Zod`, all incoming HTTP requests have guaranteed shapes. For instance, the system structurally enforces valid Enums (`INCOME` vs. `EXPENSE`) and date formatting exactly at the controller boundary. 

## Role Based Capabilities

| Feature                    | Administrator (`ADMIN`) | Financial Analyst (`ANALYST`) | Dashboard Viewer (`VIEWER`) |
| -------------------------- | :---------------------: | :---------------------------: | :-------------------------: |
| **View Dashboard Summary** |           ✅            |               ✅              |              ✅             |
| **View Financial Records** |           ✅            |               ✅              |              ❌             |
| **Create/Edit/Delete**     |           ✅            |               ❌              |              ❌             |

---

## 🚀 Setup & Execution 

1. **Install Node.js Dependencies**
Ensure you have Node.js installed, then run:

```bash
npm install
```

2. **Initialize Database**
Because this uses Prisma with SQLite, generating the local database takes only one command. It will create a `dev.db` file instantly:

```bash
npx prisma db push
```

3. **Start the Development Server**

```bash
npm run dev
```

The server will be live on `http://localhost:3000`.

---

## Example API Flow & Testing

You can use Postman, Insomnia, or cURL to interact with the API.

### 1. Register Users

**Method:** `POST /api/v1/auth/register`
**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.admin@finance.com",
  "password": "securepassword123",
  "role": "ADMIN"
}
```

Repeat this to create an `ANALYST` or `VIEWER`.

### 2. Login

**Method:** `POST /api/v1/auth/login`
**Body:**
```json
{
  "email": "jane.admin@finance.com",
  "password": "securepassword123"
}
```
**Response:** You will receive a `token`. Supply this token in the `Authorization` header (`Bearer <token>`) for subsequent requests.

### 3. Create a Financial Record (Admin Only)

**Method:** `POST /api/v1/records`
**Header:** `Authorization: Bearer <Admin_Token>`
**Body:**
```json
{
  "amount": 1500,
  "type": "EXPENSE",
  "category": "Marketing",
  "date": "2023-11-05",
  "notes": "Ad spend for campaign X"
}
```

### 4. Fetch the Dashboard Summary

**Method:** `GET /api/v1/dashboard`
**Header:** `Authorization: Bearer <Any_Available_Token>`
**Response Output:**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalIncome": 5000,
      "totalExpenses": 1500,
      "netBalance": 3500,
      "expenseByCategory": [
        { "category": "Marketing", "total": 1500 }
      ],
      "recentActivity": [ /* array of recent entries */ ]
    }
  }
}
```

## Future Improvements
- Add a frontend administrative dashboard UI (React or Vue.js).
- Implement refresh tokens for long-lived session management.
- Add granular unit and integration tests (Jest / Supertest).
- Containerize and deploy using Docker & a CI/CD pipeline.

## Architectural Design Decisions

1. **Strict Separation of Concerns**
The structure explicitly separates `routes` (HTTP matching) from `controllers` (HTTP req/res handling) from `services` (Core reusable JS logic). This makes the system incredibly easy to test dynamically.

2. **Centralized Error Handling**
A global `error.middleware.ts` intercepts exceptions, parsing Prisma issues, JWT invalidations, and validation errors returning a clean, consistent unified JSON structure back to the API consumer.

Enjoy exploring the solution!
