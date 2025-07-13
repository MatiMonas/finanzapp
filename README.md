# FinanzApp

A financial management API built with TypeScript, Express, and Prisma, following Clean Architecture principles. It allows users to manage budgets, wages, and expenses efficiently.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Bun (recommended) or bun

### 1. Install Dependencies

```bash
bun install
```

### 2. Database Setup

The project uses three different databases for different environments:

- **finanzapp-local** - For local development
- **finanzapp-test** - For running tests
- **finanzapp** - For production

#### Quick Setup (Recommended)
```bash
# Run the automated setup script
./docs/scripts/setup-databases-simple.sh
```

#### Manual Setup
```bash
# Setup each database individually
bun run db:setup:local    # Setup local database
bun run db:setup:test     # Setup test database
bun run db:setup:prod     # Setup production database
```

### 3. Start Development

```bash
# Start local development (uses finanzapp-local)
bun run dev

# Start with production database
bun run dev:prod
```

### 4. Run Tests

```bash
# Run tests (uses finanzapp-test)
bun run test

# Run tests with coverage
bun run coverage
```

## 📊 Database Environments

### Local Development
- **Database**: `finanzapp-local`
- **Configuration**: `.env.local`
- **Command**: `bun run dev`

### Testing
- **Database**: `finanzapp-test`
- **Configuration**: `.env.test`
- **Command**: `bun run test`

### Production
- **Database**: `finanzapp`
- **Configuration**: `.env`
- **Command**: `bun run dev:prod`

## 🔧 Available Scripts

### Development
```bash
bun run dev          # Local development (uses finanzapp-local)
bun run dev:prod     # Development with production DB
bun run build        # Build the project
bun run start        # Start production server
```

### Testing
```bash
bun run test         # Run tests (uses finanzapp-test)
bun run coverage     # Run tests with coverage
```

### Database Management
```bash
bun run db:setup:local  # Setup local database
bun run db:setup:test   # Setup test database
bun run db:setup:prod   # Setup production database
```

### Migrations
```bash
bun run prisma:migrate     # Create migration for local
bun run prisma:migrate:prod # Create migration for production
bun run prisma:deploy      # Apply migrations to production
bun run prisma:deploy:local # Apply migrations to local
bun run prisma:deploy-test  # Apply migrations to test
```

## 🐳 Docker

### Start with Docker
```bash
# Start only the database
docker compose up -d finanzapp-db

# Start complete application
docker compose up
```

## 📚 Documentation

### 📖 Main Documentation
- **[Knowledge Base](./docs/reference/knowledge.md)** - Understanding the application functionality
- **[API Documentation](./docs/reference/swagger.json)** - Complete API reference (Swagger/OpenAPI)
- **[Project Setup](./docs/setup/PROJECT_SETUP.md)** - Detailed project setup guide

### 🚀 Setup & Configuration
- **[Project Setup](./docs/setup/PROJECT_SETUP.md)** - Detailed setup guide
- **[Database Setup Script](./docs/scripts/setup-databases-simple.sh)** - Automated database setup
- **[Environment Configuration](./docs/README.md)** - Environment variables and configuration

### 🔧 Development
- **[Development Commands](./docs/development/commands.md)** - All available development commands
- **[Testing Guide](./docs/development/testing.md)** - Testing strategies and guidelines
- **[Troubleshooting](./docs/development/troubleshooting.md)** - Common issues and solutions

### 📋 API Endpoints
- **[Users API](./docs/endpoints/users.md)** - User management endpoints
- **[Wages API](./docs/endpoints/wages.md)** - Wage management endpoints
- **[Budgets API](./docs/endpoints/budgets.md)** - Budget management endpoints
- **[Endpoints Overview](./docs/endpoints/README.md)** - Complete API overview

### 📋 Quick Reference
- **[Command Reference](./docs/development/commands.md)** - All available commands
- **[Troubleshooting](./docs/development/troubleshooting.md)** - Common issues and solutions
- **[Changelog](./docs/CHANGELOG.md)** - Project version history

## 🔍 Troubleshooting

### Common Issues

#### MySQL Connection Error
```bash
# Check if MySQL is running
docker compose ps

# Restart MySQL
docker compose restart finanzapp-db
```

#### Migration Error
```bash
# Regenerate Prisma client
bun run prisma:generate

# Apply migrations manually
bunx prisma migrate deploy
```

#### Database Doesn't Exist
```bash
# Create database manually
mysql -u user -ppassword -h localhost -P 3307 -e "CREATE DATABASE \`finanzapp-local\`;"
```

### Verify Configuration
```bash
# Verify local database connection
bunx prisma db pull --schema=./prisma/schema.prisma

# Verify environment variables
node -e "console.log(require('dotenv').config())"
```

## 📋 Setup Checklist

- [ ] MySQL running on port 3307
- [ ] Database `finanzapp-local` exists
- [ ] Database `finanzapp-test` exists
- [ ] Database `finanzapp` exists
- [ ] `.env.local` file configured
- [ ] `.env.test` file configured
- [ ] Migrations applied to all databases
- [ ] `bun run dev` works without errors
- [ ] `bun run test` works without errors

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting guide**: [docs/development/troubleshooting.md](./docs/development/troubleshooting.md)
2. **Verify MySQL connection**:
   ```bash
   mysql -u user -ppassword -h localhost -P 3307 -e "SELECT 1;"
   ```
3. **Verify databases**:
   ```bash
   mysql -u user -ppassword -h localhost -P 3307 -e "SHOW DATABASES;"
   ```
4. **Regenerate Prisma client**:
   ```bash
   bun run prisma:generate
   ```

## 🤝 Contributing

We welcome contributions to FinanzApp! Your help is essential to improving the project and making it better for everyone.

### How to Contribute

1. **Fork the Repository**: Click on the fork button at the top right of the repository page.
2. **Create a Branch**: Use `git checkout -b feature/YourFeature` to create a new branch.
3. **Make Changes**: Make your changes in your branch.
4. **Write Tests**: Ensure that you write tests for your new functionality.
5. **Commit Changes**: Use clear and descriptive commit messages.
6. **Submit a Pull Request**: Push your changes and submit a pull request to the main repository, detailing the changes you've made.

### Reporting Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/MatiMonas/finanzapp/issues) in the repository.

## 📄 License

This project is licensed under the ISC License.
