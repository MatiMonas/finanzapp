# FinanazAPI

## Overview

FinanazAPI is built with TypeScript, Express, and Prisma, following Clean Architecture principles. It allows users to manage budgets and expenses efficiently.

## Table of Contents

- [Getting Started](#getting-started)
- [Docker](#docker)
- [Use Cases](#use-cases)
  - [Budget Configurations, Budgets, and Wages](#budget-configurations-budgets-and-wages)
    - [Creation of Budget Configurations](#creation-of-budget-configurations)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## Getting Started

TODO: Add build instructions to start the project, prerequisites, etc.

## Docker

To run the application using Docker, use the following commands:

```bash
sudo docker-compose up --build
```

To access the running container, use:

```bash
docker exec -it finanzapp /bin/sh
```

After making changes to the database schema, don't forget to run:

```bash
npx prisma generate || npx prisma migrate dev
```

## Usecases

### Budget Configurations, Budgets, and Wages

#### Create an User

First you need to create an user, to do so you need to create at least the following roles at the `Roles` table.

```sql
INSERT INTO finanzapp.roles (name, updated_at)
VALUES ('ADMIN', NOW()),
       ('USER', NOW())
       ('TEST',NOW());
```

Then execute the next curl

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/users' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "testUser",
  "password": "securePassword.1$",
  "email": "tes1t@test.com",
  "roles": [
    1
  ]
}'
```

The endpoint will return the `user.id` that you will need to use in the following endpoints.

```json
{
  "status": "success",
  "data": "2487b372-7c48-43f2-8ab7-bd0ae8ac79ae"
}
```

#### Creation of Budget Configurations

To start calculating the Budget and utilize your Wages, you must first create a Budget Configuration. This configuration will be assigned to the Wage and should have a name (e.g., "Basic") along with a user_id.

The Budget Configuration will have several associated Budgets. Each Budget must include a name and a percentage. The total sum of all Budgets' percentages must equal 100%.

#### Example of Budget Configuration Creation

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/budget-configurations' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_id": "c270dfc2-ac37-46b1-83ad-c3450d15425e",
  "budget_configuration_name": "Test",
  "budgets": [
    {
      "name": "Savings",
      "percentage": 40
    },
    {
      "name": "Food",
      "percentage": 60
    }
  ]
}'
```

## API Documentation

The API is documented using Swagger. You can access it at http://localhost:3000/api-docs.

## Roadmap

- [x] Budgets and Budget Configurations.
- [x] Wages and auto calculation of Budgets per month.
- [ ] Recalculate Budgets when adding new Wages.
- [ ] Recalculate Budgets remaining allocations if a new budget is added and the percentage per budget is changed.
- [ ] Creation of Categories that will be used when adding expenses.
- [ ] Expenses, discounting allocation from budgets when adding new expenses.
- [ ] Transfer remaining allocation to another Budget to use in the incoming month if desired.
- [ ] Credit Cards and trailing installments per card.
- [ ] Pending debts and due dates to fullfill those debts.
- [ ] Investments with Sell/Buy price per date.
- [ ] Authentication and Authorization.
- [ ] Add groups to split/track expenses together with friend/partner/roomie

## Contributing

We welcome contributions to FinanazAPI! Your help is essential to improving the project and making it better for everyone.

### How to Contribute

1. **Fork the Repository**: Click on the fork button at the top right of the repository page.
2. **Create a Branch**: Use `git checkout -b feature/YourFeature` to create a new branch.
3. **Make Changes**: Make your changes in your branch.
4. **Write Tests**: Ensure that you write tests for your new functionality.
5. **Commit Changes**: Use clear and descriptive commit messages.
6. **Submit a Pull Request**: Push your changes and submit a pull request to the main repository, detailing the changes you've made.

### Reporting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/MatiMonas/finanzapp/issues) in the repository.

### Feature Requests

Feel free to submit suggestions for new features or improvements.
