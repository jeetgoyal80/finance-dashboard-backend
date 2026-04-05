# Finance Dashboard Backend

## 1. Project Overview

I built this project as a backend assignment for a finance dashboard system. The goal was not just to expose CRUD endpoints, but to design a backend that handles authentication, role-based access, financial records, and analytics in a clean and maintainable way.

At a high level, this backend solves a common dashboard problem: different users need access to the same financial data, but not in the same way. Some users only need to view records, some need analytics, and admins need full control. I wanted that to be reflected clearly in both the API design and the internal architecture.

## 2. My Approach

My main focus was to keep the code structured from the beginning instead of letting it grow into controller-heavy logic. That is why I used a layered flow with routes, controllers, services, and repositories. It adds a bit more code up front, but it makes the system easier to reason about and easier to extend.

I also treated analytics as a core part of the assignment, not an extra feature added at the end. Since the requirements called for summary metrics, category totals, and monthly trends, I designed those endpoints around MongoDB aggregation pipelines instead of computing results in application memory.

Another early decision was to keep authorization middleware-based. I did not want role checks scattered across route handlers or controllers. Centralizing that logic makes the access rules easier to trust and easier to change later.

## 3. Key Features

- JWT-based authentication with registration, login, and current-user profile access
- Role-Based Access Control for `Viewer`, `Analyst`, and `Admin`
- Financial record management with create, read, update, and soft delete support
- Filtering by date range, category, and transaction type
- Search and pagination for scalable record retrieval
- Analytics APIs for summary, category totals, monthly trends, recent transactions, and a combined dashboard view
- Swagger/OpenAPI documentation for interactive API testing

## 4. Tech Stack and Justification

### Node.js + Express

I chose Node.js with Express because it is lightweight and gives me full control over how the backend is structured. For an assignment like this, that matters. I wanted the architecture decisions to be explicit instead of hidden behind framework conventions.

Express is a good fit for API-focused projects like this. It keeps the HTTP layer simple and lets me build clean middleware boundaries for auth, validation, and role enforcement.

### MongoDB + Mongoose

I chose MongoDB because this project benefits from flexible data modeling and strong aggregation support. The analytics part of the assignment maps well to MongoDB, especially for grouped totals, trends, and summary calculations.

Mongoose gave me the structure I wanted on top of MongoDB. It helped with schema definitions, model-level behavior, validation, and a cleaner data access layer. That balance worked well here.

### JWT Authentication

JWT made sense because it keeps authentication stateless and easy to apply across protected routes. It is also a practical fit for API-based systems where the client is expected to send a bearer token with each request.

## 5. Architecture and Folder Structure

The project follows a layered architecture:

`Route -> Controller -> Service -> Repository -> Database`

### Layer Responsibilities

- `Routes`: define endpoints and attach validation, authentication, and authorization middleware
- `Controllers`: handle request and response flow only
- `Services`: contain business logic and application rules
- `Repositories`: handle database access and query construction
- `Models/Database`: define schemas and persistence behavior

I used this separation to keep controllers thin and to avoid mixing HTTP concerns with business logic. It also makes the code easier to read because each layer has a clear job.

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

## 6. Authentication and Authorization Flow

### Authentication Flow

1. A user registers or logs in through the auth endpoints.
2. On successful login, the server generates a JWT containing the user identifier and role.
3. The client sends the token in the `Authorization` header as `Bearer <token>`.
4. Protected routes validate the token through authentication middleware and attach the current user context to the request.

### Authorization Flow

Once authentication passes, role-based middleware checks whether the current user is allowed to access the route. I kept this logic outside controllers on purpose. That keeps authorization rules consistent and avoids repeating the same checks in multiple places.

## 7. Role-Based Access Control

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

These permissions are enforced through reusable authorization middleware rather than inline checks. That was important to me because access control logic tends to become brittle when it is spread around the codebase.

## 8. Financial Records Module

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

This model supports both the operational side of the system and the analytics layer built on top of it.

### Filtering, Search, and Pagination

The records listing endpoint supports:

- date range filtering through `startDate` and `endDate`
- category filtering
- type filtering
- search across `category` and `description`
- pagination through `page` and `limit`

I included these because record retrieval is rarely useful as a plain full-list endpoint. In a dashboard setting, users usually need focused queries and smaller result sets.

### Soft Delete Logic

Records are not physically removed from the database. Instead:

- `isDeleted` is set to `true`
- `deletedAt` stores the deletion timestamp

I used soft delete because it is a better fit for financial data than hard delete. Even in a simplified assignment, keeping some trace of removed records is usually the safer design choice.

## 9. Analytics Design

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

I intentionally kept these calculations inside the database layer as much as possible. Aggregation pipelines are a better fit here because:

- computation happens closer to the data
- less raw data needs to be loaded into application memory
- grouped queries scale better than manual loops
- the backend logic stays closer to how analytical APIs are usually built in real systems

This part of the project mattered a lot because the assignment was clearly testing backend reasoning, not only endpoint implementation.

## 10. API Documentation

Swagger UI is available at:

`http://localhost:5000/api-docs`

It gives an easy way to inspect endpoints, request bodies, query parameters, and responses without needing a frontend client.

### Using JWT in Swagger

1. Authenticate via `/api/auth/login`
2. Copy the returned JWT
3. Click `Authorize` in Swagger UI
4. Enter the token as `Bearer <token>`

After that, protected endpoints can be tested directly from Swagger.

## 11. Validation and Error Handling

### Input Validation

Validation is handled with `express-validator`. I kept validation rules close to each module and ran them through shared validation middleware before requests reach the service layer.

That keeps the service logic cleaner and prevents invalid data from leaking deeper into the application flow.

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

## 12. Assumptions and Design Decisions

### Assumptions

- user self-registration creates accounts with the `Viewer` role by default
- role and status management are reserved for `Admin`
- financial records are treated as system-wide records rather than per-tenant data
- soft-deleted records should not appear in normal list or analytics queries

### Design Trade-Offs

- MongoDB was preferred over SQL because this assignment benefits more from flexible iteration and aggregation-powered analytics than relational constraints
- Swagger documentation is embedded directly in code for convenience and easier evaluation
- service and repository layers add extra structure even though they also add more boilerplate than a quick prototype

## 13. Challenges Faced

One of the main challenges was keeping the analytics implementation clean without pushing too much logic into controllers or writing quick one-off queries. It would have been easy to compute totals in JavaScript after fetching records, but that would miss the point of the assignment and would not scale well. Designing those analytics around aggregation pipelines took a little more care, but it led to a much better result.

Another challenge was RBAC. The rules themselves are simple, but the important part was enforcing them consistently. I wanted the role behavior to be obvious from the route layer and not dependent on ad hoc checks buried inside controllers.

Swagger and deployment introduced another practical challenge. Local development is straightforward, but once the backend is deployed, the docs need to point to the correct server URL and work with CORS properly. Fixing that was part of making the project feel complete rather than just locally functional.

## 14. Setup Instructions

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

## 15. Future Improvements

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

## 16. What I Would Improve

If I were taking this beyond assignment scope, the first thing I would add is automated test coverage around auth, RBAC, and analytics queries. Those are the most important parts of the system behavior, and they deserve direct verification.

I would also improve operational concerns such as structured logging, better environment-based configuration, rate limiting, and more production-ready deployment defaults. Right now the project is intentionally assignment-friendly and easy to review, but there is room to harden it further.

On the data side, I would likely introduce better auditing and possibly a more explicit ownership model for records if the system ever needed to support multiple organizations or business units.

## Conclusion

I built this backend to show solid backend engineering fundamentals: layered architecture, clean separation of concerns, middleware-based access control, strong validation, and analytics powered by database-native aggregation. The result is a modular API that is practical to work with and structured in a way that can grow beyond a small assignment if needed.
