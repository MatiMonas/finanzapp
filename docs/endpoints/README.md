# API Endpoints Documentation

This directory contains the complete API documentation for FinanzApp, organized by components.

## Components

### [Users](./users.md)

User management endpoints including user creation and authentication.

**Available Endpoints:**

- `GET /users` - Test endpoint
- `POST /users` - Create new user

### [Budgets](./budgets.md)

Budget management endpoints for creating and managing budget configurations.

**Available Endpoints:**

- `GET /budgets/:id` - Get specific budget
- `GET /budget-configurations` - List budget configurations
- `POST /budget-configurations` - Create budget configuration
- `PATCH /budget-configurations/:id` - Update budget configuration
- `DELETE /budget-configurations/:id` - Delete budget configuration

### [Wages](./wages.md)

Wage management endpoints for tracking user salaries.

**Available Endpoints:**

- `POST /wages` - Create wage record

---

## General Information

### Base URL

```
http://localhost:3000
```

### Authentication

All endpoints require authentication except for the test endpoints. Include your authentication token in the request headers.

### Content Type

All POST, PATCH, and PUT requests should include:

```
Content-Type: application/json
```

### Common HTTP Status Codes

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `204 No Content` - Successful operation with no response content
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Internal server error

### Database Tables

The application uses the following main database tables:

- `users` - User information
- `user_roles` - User-role relationships
- `roles` - Available roles
- `budgets_configuration` - Budget configurations
- `budgets` - Individual budgets
- `wages` - Wage records
- `monthly_wage_summary` - Monthly wage summaries

### Soft Delete

All resources use soft delete, meaning they are not physically removed from the database. Instead, a `deleted_at` timestamp is set.
