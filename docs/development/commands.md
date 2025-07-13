# Command Reference - FinanzApp

A complete reference of all available commands for the FinanzApp project.

## 🚀 Development Commands

### Start Development Server

```bash
# Local development (uses finanzapp-local database)
npm run dev

# Development with production database
npm run dev:prod

# Build the project
npm run build

# Start production server
npm run start
```

### Testing Commands

```bash
# Run all tests (uses finanzapp-test database)
npm run test

# Run tests with coverage report
npm run coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Database Commands

### Setup Commands

```bash
# Setup local database (finanzapp-local)
npm run db:setup:local

# Setup test database (finanzapp-test)
npm run db:setup:test

# Setup production database (finanzapp)
npm run db:setup:prod

# Setup all databases at once
./docs/scripts/setup-databases-simple.sh
```

### Migration Commands

```bash
# Create new migration for local environment
npm run prisma:migrate

# Create new migration for production environment
npm run prisma:migrate:prod

# Apply migrations to production database
npm run prisma:deploy

# Apply migrations to local database
npm run prisma:deploy:local

# Apply migrations to test database
npm run prisma:deploy-test

# Generate Prisma client
npm run prisma:generate
```

### Database Utilities

```bash
# Reset local database
npm run db:reset:local

# Reset test database
npm run db:reset:test

# Reset production database
npm run db:reset:prod

# Seed database with sample data
npm run db:seed
```

## 🐳 Docker Commands

### Container Management

```bash
# Start only the database container
docker compose up -d finanzapp-db

# Start all services
docker compose up

# Start all services in background
docker compose up -d

# Stop all services
docker compose down

# Restart database service
docker compose restart finanzapp-db

# View running containers
docker compose ps

# View container logs
docker compose logs finanzapp
```

### Database Container

```bash
# Access MySQL container
docker exec -it finanzapp-db mysql -u user -ppassword

# Backup database
docker exec finanzapp-db mysqldump -u user -ppassword finanzapp-local > backup.sql

# Restore database
docker exec -i finanzapp-db mysql -u user -ppassword finanzapp-local < backup.sql
```

## 🔧 Utility Commands

### Environment Management

```bash
# Check environment variables
node -e "console.log(require('dotenv').config())"

# Validate environment configuration
npm run env:validate

# Generate environment template
npm run env:template
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Run all code quality checks
npm run quality
```

### Build Commands

```bash
# Build for development
npm run build:dev

# Build for production
npm run build:prod

# Clean build artifacts
npm run clean

# Analyze bundle size
npm run analyze
```

## 📋 Script Commands

### Automated Setup

```bash
# Full setup with Docker support
./docs/scripts/setup-databases.sh

# Simplified setup without Docker
./docs/scripts/setup-databases-simple.sh

# Quick project setup
npm run setup

# Setup development environment
npm run setup:dev
```

### Maintenance Commands

```bash
# Update dependencies
npm run update

# Check for outdated packages
npm run outdated

# Audit security vulnerabilities
npm run audit

# Fix security issues
npm run audit:fix
```

## 🔍 Debugging Commands

### Logging

```bash
# Start with debug logging
DEBUG=* npm run dev

# Start with specific debug namespace
DEBUG=finanzapp:* npm run dev

# View application logs
npm run logs

# View error logs only
npm run logs:error
```

### Database Debugging

```bash
# Test database connection
npm run db:test-connection

# Verify database schema
npm run db:verify-schema

# Check database status
npm run db:status

# Reset database and run migrations
npm run db:reset
```

## 🧪 Testing Commands

### Test Execution

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- src/components/users/__tests__/user.test.ts

# Run tests matching pattern
npm run test -- --testNamePattern="User"

# Run tests in specific directory
npm run test -- src/components/budgets/

# Run tests with verbose output
npm run test -- --verbose
```

### Coverage

```bash
# Generate coverage report
npm run coverage

# Generate coverage with HTML report
npm run coverage:html

# Check coverage thresholds
npm run coverage:check

# Generate coverage badge
npm run coverage:badge
```

## 📊 Monitoring Commands

### Performance

```bash
# Start with performance monitoring
npm run dev:profile

# Generate performance report
npm run profile

# Monitor memory usage
npm run monitor:memory

# Monitor CPU usage
npm run monitor:cpu
```

### Health Checks

```bash
# Check application health
npm run health:check

# Check database health
npm run health:db

# Check all services health
npm run health:all
```

## 🚀 Deployment Commands

### Production Deployment

```bash
# Build for production
npm run build:prod

# Deploy to production
npm run deploy:prod

# Rollback deployment
npm run deploy:rollback

# Check deployment status
npm run deploy:status
```

### Staging Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Test staging environment
npm run test:staging

# Promote staging to production
npm run deploy:promote
```

## 📝 Documentation Commands

### Generate Documentation

```bash
# Generate API documentation
npm run docs:generate

# Generate code documentation
npm run docs:code

# Generate database documentation
npm run docs:db

# Generate all documentation
npm run docs:all
```

### Documentation Validation

```bash
# Validate API documentation
npm run docs:validate

# Check documentation links
npm run docs:check-links

# Generate documentation site
npm run docs:build
```

## 🔧 Configuration Commands

### Environment Setup

```bash
# Copy environment template
npm run env:copy

# Validate environment variables
npm run env:validate

# Generate environment documentation
npm run env:docs
```

### Database Configuration

```bash
# Initialize database
npm run db:init

# Configure database settings
npm run db:config

# Test database configuration
npm run db:test-config
```

## 📋 Quick Reference

### Most Used Commands

```bash
# Development
npm run dev                    # Start development server
npm run test                   # Run tests
npm run build                  # Build project

# Database
npm run db:setup:local        # Setup local database
npm run prisma:migrate        # Create migration
npm run prisma:deploy         # Apply migrations

# Docker
docker compose up -d          # Start services
docker compose down           # Stop services

# Setup
./docs/scripts/setup-databases-simple.sh  # Quick setup
```

### Troubleshooting Commands

```bash
# Database issues
npm run db:test-connection    # Test database connection
npm run prisma:generate       # Regenerate Prisma client

# Environment issues
node -e "console.log(require('dotenv').config())"  # Check env vars

# Build issues
npm run clean                 # Clean build artifacts
npm run build                 # Rebuild project
```

## 🆘 Help Commands

### Get Help

```bash
# Show all available commands
npm run

# Show command help
npm run --help

# Show specific command help
npm run <command> --help
```

### Version Information

```bash
# Show Node.js version
node --version

# Show npm version
npm --version

# Show project version
npm run version

# Show all dependency versions
npm list
```

---

**Note**: All commands should be run from the project root directory. Make sure you have the required dependencies installed before running any commands.
