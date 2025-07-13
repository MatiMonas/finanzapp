# FinanzApp

A financial management API built with TypeScript, Express, and Prisma, following Clean Architecture principles. It allows users to manage budgets, wages, and expenses efficiently.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or bun

### 1. Install Dependencies

```bash
npm install
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
npm run db:setup:local    # Setup local database
npm run db:setup:test     # Setup test database
npm run db:setup:prod     # Setup production database
```

### 3. Start Development

```bash
# Start local development (uses finanzapp-local)
npm run dev

# Start with production database
npm run dev:prod
```

### 4. Run Tests

```bash
# Run tests (uses finanzapp-test)
npm run test

# Run tests with coverage
npm run coverage
```

## 📊 Database Environments

### Local Development
- **Database**: `finanzapp-local`
- **Configuration**: `.env.local`
- **Command**: `npm run dev`

### Testing
- **Database**: `finanzapp-test`
- **Configuration**: `.env.test`
- **Command**: `npm run test`

### Production
- **Database**: `finanzapp`
- **Configuration**: `.env`
- **Command**: `npm run dev:prod`

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Local development (uses finanzapp-local)
npm run dev:prod     # Development with production DB
npm run build        # Build the project
npm run start        # Start production server
```

### Testing
```bash
npm run test         # Run tests (uses finanzapp-test)
npm run coverage     # Run tests with coverage
```

### Database Management
```bash
npm run db:setup:local  # Setup local database
npm run db:setup:test   # Setup test database
npm run db:setup:prod   # Setup production database
```

### Migrations
```bash
npm run prisma:migrate     # Create migration for local
npm run prisma:migrate:prod # Create migration for production
npm run prisma:deploy      # Apply migrations to production
npm run prisma:deploy:local # Apply migrations to local
npm run prisma:deploy-test  # Apply migrations to test
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
- **[Knowledge Base](./docs/knowledge.md)** - Understanding the application functionality
- **[API Documentation](./docs/api.md)** - Complete API reference
- **[Architecture Guide](./docs/architecture.md)** - System architecture and design patterns

### 🚀 Setup & Configuration
- **[Setup Instructions](./docs/setup/SETUP_INSTRUCTIONS.md)** - Detailed setup guide
- **[Database Configuration](./docs/database/DATABASE_SETUP.md)** - Database setup and management
- **[Environment Configuration](./docs/environment.md)** - Environment variables and configuration

### 🔧 Development
- **[Development Guide](./docs/development.md)** - Development workflow and best practices
- **[Testing Guide](./docs/testing.md)** - Testing strategies and guidelines
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions

### 📋 Quick Reference
- **[Command Reference](./docs/commands.md)** - All available commands
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[FAQ](./docs/faq.md)** - Frequently asked questions

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
npm run prisma:generate

# Apply migrations manually
npx prisma migrate deploy
```

#### Database Doesn't Exist
```bash
# Create database manually
mysql -u user -ppassword -h localhost -P 3307 -e "CREATE DATABASE \`finanzapp-local\`;"
```

### Verify Configuration
```bash
# Verify local database connection
npx prisma db pull --schema=./prisma/schema.prisma

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
- [ ] `npm run dev` works without errors
- [ ] `npm run test` works without errors

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting guide**: [docs/troubleshooting.md](./docs/troubleshooting.md)
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
   npm run prisma:generate
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
