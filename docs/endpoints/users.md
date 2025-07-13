# Users Component - API Endpoints

This document describes all endpoints available for the Users component.

## Endpoints

### GET /users

**Description:** Test endpoint to verify the Users component is working correctly.

**Curl:**

```bash
curl -X GET http://localhost:3000/users
```

**Payload:** No payload required

**Expected Response:**

```json
{
  "message": "Users component working"
}
```

**Database Tables Involved:** None

---

### POST /users

**Description:** Creates a new user in the system with their credentials and assigned roles.

**Curl:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "example_user",
    "email": "user@example.com",
    "password": "password123",
    "roles": [1, 2]
  }'
```

**Payload:**

```typescript
{
  username: string;    // Unique username (max 25 characters)
  email: string;       // Unique email (max 30 characters)
  password: string;    // Password (max 255 characters)
  roles: number[];     // Array of role IDs to assign
}
```

**Expected Response:**

```json
{
  "id": "user-uuid",
  "username": "example_user",
  "email": "user@example.com",
  "roles": [1, 2],
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Database Tables Involved:**

- `users` - Stores user information
- `user_roles` - Many-to-many relationship between users and roles
- `roles` - Available roles table

---

## Notes

### Authentication & Authorization

- All endpoints require authentication (except the test endpoint)
- Users can only access their own data
- Resource ownership is validated before allowing modifications

### Validations

- Emails must be unique in the system
- Usernames must be unique
- Password must meet security requirements
- Role IDs must exist in the roles table

### HTTP Status Codes

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Internal server error
