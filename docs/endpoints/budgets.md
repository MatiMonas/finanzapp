# Budgets Component - API Endpoints

This document describes all endpoints available for the Budgets component.

## Endpoints

### GET /budgets/:id

**Description:** Gets the details of a specific budget by its ID.

**Curl:**

```bash
curl -X GET http://localhost:3000/budgets/123
```

**Payload:** No payload required

**URL Parameters:**

```typescript
{
  id: number; // ID of the budget to query
}
```

**Expected Response:**

```json
{
  "id": 123,
  "user_id": "user-uuid",
  "name": "Food",
  "percentage": 30.0,
  "remaining_allocation": 1500.0,
  "budget_configuration_id": 1,
  "monthly_wage_summary_id": 5,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Database Tables Involved:**

- `budgets` - Budget information

---

### GET /budget-configurations

**Description:** Gets all budget configurations for a user with their associated budgets.

**Curl:**

```bash
curl -X GET "http://localhost:3000/budget-configurations?user_id=user-uuid"
```

**Payload:** No payload required

**Query Parameters:**

```typescript
{
  user_id?: string;      // User ID (optional)
  name?: string;         // Configuration name (optional)
  is_active?: boolean;   // Active status (optional)
  created_at?: Date;     // Creation date (optional)
  updated_at?: Date;     // Update date (optional)
}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "name": "Main Configuration",
    "user_id": "user-uuid",
    "is_public": false,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "budgets": [
      {
        "id": 1,
        "name": "Food",
        "percentage": 30.0,
        "remaining_allocation": 1500.0
      },
      {
        "id": 2,
        "name": "Transport",
        "percentage": 20.0,
        "remaining_allocation": 1000.0
      }
    ]
  }
]
```

**Database Tables Involved:**

- `budgets_configuration` - Budget configurations
- `budgets` - Budgets associated with each configuration

---

### POST /budget-configurations

**Description:** Creates a new budget configuration with its associated budgets.

**Curl:**

```bash
curl -X POST http://localhost:3000/budget-configurations \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "budget_configuration_name": "My Configuration",
    "budgets": [
      {
        "name": "Food",
        "percentage": 30.0
      },
      {
        "name": "Transport",
        "percentage": 20.0
      }
    ]
  }'
```

**Payload:**

```typescript
{
  user_id: string; // Owner user ID
  budget_configuration_name: string; // Configuration name
  budgets: {
    name: string; // Budget name
    percentage: number; // Assigned percentage (0-100)
  }
  [];
}
```

**Expected Response:**

```json
{
  "success": true
}
```

**Database Tables Involved:**

- `budgets_configuration` - New configuration created
- `budgets` - Budgets associated with the configuration

---

### PATCH /budget-configurations/:id

**Description:** Partially updates an existing budget configuration.

**Curl:**

```bash
curl -X PATCH http://localhost:3000/budget-configurations/1 \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "budget_configuration_name": "New Name",
    "budgets": [
      {
        "id": 1,
        "name": "Updated Food",
        "percentage": 35.0
      }
    ]
  }'
```

**Payload:**

```typescript
{
  user_id: string;                    // Owner user ID
  budget_configuration_name?: string; // New name (optional)
  budgets?: {
    id?: number;        // Budget ID (for updating)
    name?: string;      // New name
    percentage?: number; // New percentage
    create?: boolean;   // Flag to create new budget
    delete?: boolean;   // Flag to delete budget
  }[];
}
```

**Expected Response:**

```json
{
  "success": true
}
```

**Database Tables Involved:**

- `budgets_configuration` - Updated configuration
- `budgets` - Updated/created/deleted budgets

---

### DELETE /budget-configurations/:id

**Description:** Deletes a budget configuration and all its associated budgets.

**Curl:**

```bash
curl -X DELETE http://localhost:3000/budget-configurations/1 \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid"
  }'
```

**Payload:**

```typescript
{
  user_id: string; // Owner user ID
}
```

**URL Parameters:**

```typescript
{
  id: number; // ID of the configuration to delete
}
```

**Expected Response:**

```json
{
  "success": true
}
```

**Database Tables Involved:**

- `budgets_configuration` - Deleted configuration (soft delete)
- `budgets` - Associated budgets deleted (soft delete)

---

## Notes

### Authentication & Authorization

- All endpoints require authentication
- Users can only access their own budget configurations
- Resource ownership is validated before allowing modifications

### Validations

- Budget IDs must be valid numbers
- Budget percentages must be between 0 and 100
- Configuration names must be unique per user
- Users can only modify their own configurations

### HTTP Status Codes

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `204 No Content` - Successful operation with no response content
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Internal server error

### Soft Delete

- Resources are not physically deleted from the database
- The `deleted_at` field is marked with the deletion date
- Deleted resources do not appear in normal queries
