# Wages Component - API Endpoints

This document describes all endpoints available for the Wages component.

## Endpoints

### POST /wages

**Description:** Creates a new wage record for a user in a specific month and year.

**Curl:**

```bash
curl -X POST http://localhost:3000/wages \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "amount": 50000.0,
    "month": "01",
    "year": "2024",
    "currency": "ARS"
  }'
```

**Payload:**

```typescript
{
  user_id: string; // User ID
  amount: number; // Wage amount
  month: string; // Month (format: "01", "02", etc.)
  year: string; // Year (format: "2024")
  currency: 'USD' | 'ARS'; // Wage currency
}
```

**Expected Response:**

```json
{
  "success": true
}
```

**Database Tables Involved:**

- `wages` - New wage record
- `monthly_wage_summary` - Monthly wage summary (created or updated)

---

## Notes

### Authentication & Authorization

- All endpoints require authentication
- Users can only create wage records for themselves
- Resource ownership is validated before allowing modifications

### Validations

- User ID must be valid and exist in the system
- Amount must be a positive number
- Month must be between "01" and "12"
- Year must be a valid year format
- Currency must be either "USD" or "ARS"
- Only one wage record per user per month/year combination

### HTTP Status Codes

- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Wage record already exists for this month/year
- `500 Internal Server Error` - Internal server error

### Business Logic

- When a wage is created, the system automatically calculates exchange rates
- The system creates or updates a monthly wage summary
- Wage amounts are converted to both USD and ARS for consistency
- The remaining amount in the monthly summary is updated accordingly
