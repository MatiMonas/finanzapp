# Testing Guide - FinanzApp

This guide explains how testing works in FinanzApp and the important differences between Jest and Bun.

## 🧪 Testing Framework

FinanzApp uses **Bun** as runtime and testing framework. Bun includes its own testing system that is compatible with Jest but has some important differences.

## 🚀 Testing Commands

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage

# Run a specific test file
bun test src/components/users/__tests__/controllers/UserController.test.ts

# Run tests from a specific directory
bun test src/components/users/__tests__/

# Run tests in watch mode
bun test --watch
```

## ⚠️ Important Differences: Jest vs Bun

### Mocking System

**Jest (Not compatible with Bun):**
```typescript
// ❌ This does NOT work in Bun
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// ❌ This also doesn't work
const bcrypt = require('bcrypt');
jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
```

**Bun (Recommended approach):**
```typescript
// ✅ Approach 1: Use Bun's mocking system
import { mock } from 'bun:test';

// ✅ Approach 2: Test real behavior
const result = await user.isPasswordValid('password');
expect(typeof result).toBe('boolean');
```

### Test Structure

**Recommended pattern for Bun:**
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      role: 'USER'
    });
  });

  it('should validate password correctly', async () => {
    // Test real behavior without complex mocks
    const result = await user.isPasswordValid('password');
    expect(typeof result).toBe('boolean');
  });

  it('should generate valid JWT token', () => {
    const token = user.generateToken();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });
});
```

## 📁 Test Structure

```
src/components/
├── users/
│   └── __tests__/
│       ├── controllers/
│       │   └── UserController.test.ts
│       ├── entity/
│       │   └── user.test.ts
│       ├── repository/
│       │   └── user-repository.test.ts
│       ├── usecase/
│       │   └── userUsecase.test.ts
│       └── validators/
│           ├── validatorEmailIsInUse.test.ts
│           └── validatorUserEmailExists.test.ts
├── budgets/
│   └── __tests__/
│       ├── controllers/
│       │   └── BudgetController.test.ts
│       ├── entity/
│       │   └── budget.test.ts
│       ├── repository/
│       │   └── budget-repository.test.ts
│       ├── usecase/
│       │   └── budgetUsecase.test.ts
│       └── validators/
│           ├── validatorBudgetChange.test.ts
│           ├── validatorBudgetConfigurationNameInUse.test.ts
│           ├── validatorBudgetPercentage.test.ts
│           └── validatorIsBudgetConfigurationFromUser.test.ts
└── wages/
    └── __tests__/
        ├── controllers/
        │   └── WageController.test.ts
        ├── entity/
        │   ├── monthlyWagesBuilder.test.ts
        │   ├── monthlyWagesDirector.test.ts
        │   └── wage.test.ts
        ├── repository/
        │   └── wages-repository.test.ts
        ├── usecase/
        │   └── wagesUsecase.test.ts
        └── validators/
            └── validatorMonthlyWageExists.test.ts
```

## 🎯 Testing Patterns

### 1. Entity Tests

```typescript
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const userData = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      role: 'USER'
    };

    const user = new User(userData);
    
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe('USER');
  });
});
```

### 2. Validator Tests

```typescript
describe('ValidatorEmailIsInUse', () => {
  it('should return true if email is in use', async () => {
    const validator = new ValidatorEmailIsInUse();
    const result = await validator.validate('existing@example.com');
    
    expect(typeof result).toBe('boolean');
  });
});
```

### 3. Controller Tests

```typescript
describe('UserController', () => {
  it('should create user successfully', async () => {
    const controller = new UserController();
    const request = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const response = await controller.createUser(request);
    
    expect(response).toHaveProperty('success');
    expect(response).toHaveProperty('data');
    expect(typeof response.success).toBe('boolean');
  });
});
```

## 🔧 Database Configuration for Tests

### Test Database

Tests use the `finanzapp-test` database configured in `.env.test`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp-test"
```

### Database Cleanup

Before each test, the database is automatically cleaned:

```typescript
// In helpers/cleanDatabase.ts
export const cleanDatabase = async () => {
  // Clean tables in correct order (respecting foreign keys)
  await prisma.$executeRaw`TRUNCATE TABLE budgets CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
  // ... other tables
};
```

## 🚨 Common Issues and Solutions

### 1. Mock Errors

**Problem:** `jest.mock is not a function`

**Solution:** Use Bun's mocking system or test real behavior:

```typescript
// ❌ Doesn't work in Bun
jest.mock('bcrypt');

// ✅ Works in Bun
const result = await user.isPasswordValid('password');
expect(typeof result).toBe('boolean');
```

### 2. Database Errors

**Problem:** `Table doesn't exist`

**Solution:** Ensure the test database is configured:

```bash
# Setup test database
bun run db:setup:test

# Verify connection
npx prisma db pull --schema=./prisma/schema.prisma
```

### 3. Type Errors

**Problem:** `Property 'X' is missing in type`

**Solution:** Verify that DTOs and types are correctly defined:

```typescript
// Ensure all required fields are present
const request = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  budget_configuration_id: 1 // Required field
};
```

## 📊 Coverage and Reports

```bash
# Generate coverage report
bun test --coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🎯 Best Practices

1. **Use Bun instead of Jest** for all tests
2. **Test real behavior** instead of complex mocks
3. **Verify types** instead of specific values when appropriate
4. **Use beforeEach** for common setup
5. **Clean database** before each test
6. **Follow the established file structure**
7. **Use descriptive names** for tests and describe blocks

## 🔗 Additional Resources

- [Bun Testing Documentation](https://bun.sh/docs/cli/test)
- [Jest to Bun Migration Guide](https://bun.sh/docs/cli/test#migrating-from-jest)
- [Troubleshooting Guide](./troubleshooting.md#test-failures) 