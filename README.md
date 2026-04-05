# Finance Dashboard Backend

## 1. Project Overview

This project is a backend engineering assignment for a finance dashboard system. It provides secure APIs for authentication, role-based access control, financial record management, and analytical reporting.

The system solves the backend side of a finance dashboard use case where different user roles need controlled access to operational and analytical financial data. Beyond basic CRUD, the project is designed to demonstrate structured backend thinking through layered architecture, centralized authorization, validation, and aggregation-driven analytics.

## 2. Key Features

- JWT-based authentication with registration, login, and current-user profile access
- Role-Based Access Control for `Viewer`, `Analyst`, and `Admin`
- Financial record management with create, read, update, and soft delete support
- Filtering by date range, category, and transaction type
- Search and pagination for scalable record retrieval
- Analytics APIs for summary, category totals, monthly trends, recent transactions, and a combined dashboard view
- Swagger/OpenAPI documentation for interactive API testing

## 3. Tech Stack and Justification

### Node.js + Express

Node.js with Express was selected because it is lightweight, productive, and well-suited for API-oriented backend services. Express keeps the HTTP layer simple and allows the project architecture to be designed explicitly instead of being tightly coupled to a heavy framework.

### MongoDB + Mongoose

MongoDB was chosen because the assignment emphasizes analytics and flexible data modeling. Aggregation pipelines are a strong fit for financial summaries, grouped totals, and trend calculations. Mongoose adds schema control, model validation, middleware hooks, and a clean data access abstraction while preserving MongoDB’s flexibility.

### JWT Authentication

JWT was chosen because it enables stateless authentication, which keeps the API scalable and simple to secure across protected routes. It also integrates naturally with middleware-driven authorization.

## 4. Architecture and Folder Structure

The project follows a layered architecture:

`Route -> Controller -> Service -> Repository -> Database`

### Layer Responsibilities

- `Routes`: define endpoints and apply validation, authentication, and authorization middleware
- `Controllers`: manage request-response handling only
- `Services`: contain business rules and application logic
- `Repositories`: encapsulate database interactions and query construction
- `Models/Database`: define schemas and persistence behavior

This separation keeps controllers thin, avoids mixing HTTP concerns with business logic, and makes the codebase easier to extend and maintain.

### Folder Structure

```text
src/
  modules/
    auth/
      auth.controller.js
      auth.routes.js
      auth.validation.js
    user/
      user.controller.js
      user.model.js
      user.routes.js
      user.validation.js
    finance/
      finance.controller.js
      finance.model.js
      finance.routes.js
      finance.validation.js
    analytics/
      analytics.controller.js
      analytics.routes.js
      analytics.validation.js
  middleware/
    auth.middleware.js
    error.middleware.js
    role.middleware.js
    validate.middleware.js
  services/
    analytics.service.js
    auth.service.js
    finance.service.js
    user.service.js
  repositories/
    finance.repository.js
    user.repository.js
  utils/
    api-error.js
    catch-async.js
    constants.js
    query.js
    token.js
  config/
    db.js
    env.js
  docs/
    openapi.js
  seed/
    seed.js
  app.js
  server.js
```

## 5. Authentication and Authorization Flow

### Authentication Flow

1. A user registers or logs in through the auth endpoints.
2. On successful login, the server generates a JWT containing the user identifier and role.
3. The client sends the token in the `Authorization` header as `Bearer <token>`.
4. Protected routes validate the token through authentication middleware and attach the current user context to the request.

### Authorization Flow

After authentication succeeds, role-based middleware checks whether the current user is allowed to access the route. This keeps access rules centralized and avoids duplicating role logic in controllers.

## 6. Role-Based Access Control

The system supports three roles:

### Viewer

- Read-only access to financial records
- No access to analytics endpoints
- No access to user management
- Cannot create, update, or delete financial records

### Analyst

- Read access to financial records
- Access to analytics endpoints
- No access to user management
- Cannot create, update, or delete financial records

### Admin

- Full financial record management access
- Access to analytics endpoints
- Access to user management endpoints
- Can update user role and status

These permissions are enforced using reusable authorization middleware rather than inline checks.

## 7. Financial Records Module

### Data Model

Each financial record contains:

- `amount`
- `type` (`income` or `expense`)
- `category`
- `date`
- `description`
- `createdBy`
- `isDeleted`
- `deletedAt`

This model supports both operational record management and analytical aggregation.

### Filtering, Search, and Pagination

The records listing endpoint supports:

- date range filtering through `startDate` and `endDate`
- category filtering
- type filtering
- search across `category` and `description`
- pagination through `page` and `limit`

These capabilities make the API practical for dashboard workflows where datasets grow over time and users need focused queries instead of bulk retrieval.

### Soft Delete Logic

Records are not physically removed from the database. Instead:

- `isDeleted` is set to `true`
- `deletedAt` stores the deletion timestamp

Soft delete was chosen to preserve recoverability and auditability. For financial systems, even at assignment scope, retaining deletion history is preferable to permanent deletion.

## 8. Analytics Design

Analytics are implemented using MongoDB aggregation pipelines rather than manual computation in application code.

### Supported Analytics

- total income
- total expenses
- net balance
- category-wise totals
- monthly trends
- recent transactions
- combined dashboard response

### Calculation Design

- Summary analytics use conditional aggregation to calculate total income and expenses, then derive net balance.
- Category totals group records by `category` and `type` to provide segmented spending and income insights.
- Monthly trends group by year and month, then compute income, expenses, and net balance for each period.
- Recent transactions use aggregation stages for filtering, sorting, limiting, and joining creator information.

### Why Aggregation Pipelines

Aggregation is preferred because:

- computation happens closer to the database
- less raw data needs to be transferred into application memory
- grouped calculations remain efficient as data volume grows
- the implementation better reflects real analytical API design

This is an important architectural choice because the assignment explicitly emphasizes analytics quality, not just endpoint completeness.

## 9. API Documentation

Swagger UI is available at:

`http://localhost:5000/api-docs`

It provides an interactive interface for viewing endpoint definitions, request bodies, query parameters, and responses.

### Using JWT in Swagger

1. Authenticate via `/api/auth/login`
2. Copy the returned JWT
3. Click `Authorize` in Swagger UI
4. Enter the token as `Bearer <token>`

After authorization, protected endpoints can be tested directly from Swagger.

## 10. Validation and Error Handling

### Input Validation

Validation is handled using `express-validator`. Request rules are defined close to each module and executed through shared validation middleware before business logic is reached.

### Standardized Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {}
}
```

Error responses follow the same pattern:

```json
{
  "success": false,
  "message": "Error description",
  "details": []
}
```

### Error Handling Strategy

- centralized error middleware handles known and unexpected failures
- custom API errors carry meaningful status codes and messages
- validation failures return field-level details
- authentication and authorization failures return clear access-related errors

## 11. Assumptions and Design Decisions

### Assumptions

- user self-registration creates accounts with the `Viewer` role by default
- role and status management are reserved for `Admin`
- financial records are treated as system-wide records rather than per-tenant data
- soft-deleted records should not appear in normal list or analytics queries

### Design Trade-Offs

- MongoDB was preferred over SQL because the assignment benefits more from flexible iteration and aggregation-powered analytics than relational constraints
- Swagger documentation is embedded directly in code for evaluator convenience and ease of testing
- service and repository layers add structure and clarity even though they introduce more boilerplate than a quick prototype

## 12. Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB running locally or accessible through a connection URI

### Environment Variables

Create a `.env` file with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/finance_dashboard_assignment
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

### Run Locally

```bash
npm install
npm run seed
npm run dev
```

### Default Seed Users

- Admin: `admin@finance.local` / `Admin@123`
- Analyst: `analyst@finance.local` / `Analyst@123`
- Viewer: `viewer@finance.local` / `Viewer@123`

### Useful Local URLs

- Root: `http://localhost:5000/`
- Health: `http://localhost:5000/health`
- Swagger Docs: `http://localhost:5000/api-docs`

## 13. Future Improvements

Potential production-grade enhancements include:

- rate limiting for authentication and sensitive endpoints
- refresh token support and token rotation
- structured logging and request tracing
- automated tests for services and routes
- caching for heavy analytics queries
- audit logging for user and finance changes
- stronger password policy enforcement
- Docker-based development setup
- CI/CD integration
- multi-tenant support if the system evolves beyond a single organization

## Conclusion

This backend is designed to demonstrate strong backend engineering fundamentals: clear separation of concerns, middleware-based access control, robust validation, and analytics implemented through database-native aggregation. The result is a modular and maintainable API system aligned with the goals of the assignment.
