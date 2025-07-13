# Command Reference - FinanzApp

A complete reference of all available commands for the FinanzApp project.

## 🚀 Development Commands

### Start Development Server

```bash
# Local development (uses finanzapp-local database)
bun run dev

# Development with production database
bun run dev:prod

# Build the project
bun run build

# Start production server
bun run start
```

### Testing Commands

```bash
# Run all tests (uses finanzapp-test database)
bun run test

# Run tests with coverage report
bun run coverage

# Run tests in watch mode
bun run test:watch
```

## 📊 Database Commands

### Setup Commands

```bash
# Setup local database (finanzapp-local)
bun run db:setup:local

# Setup test database (finanzapp-test)
bun run db:setup:test

# Setup production database (finanzapp)
bun run db:setup:prod

# Setup all databases at once
./docs/scripts/setup-databases-simple.sh
```

### Migration Commands

```bash
# Create new migration for local environment
bun run prisma:migrate

# Create new migration for production environment
bun run prisma:migrate:prod

# Apply migrations to production database
bun run prisma:deploy

# Apply migrations to local database
bun run prisma:deploy:local

# Apply migrations to test database
bun run prisma:deploy-test

# Generate Prisma client
bun run prisma:generate
```

### Database Utilities

```bash
# Reset local database
bun run db:reset:local

# Reset test database
bun run db:reset:test

# Reset production database
bun run db:reset:prod

# Seed database with sample data
bun run db:seed
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
bun run env:validate

# Generate environment template
bun run env:template
```

### Code Quality

```bash
# Run linting
bun run lint

# Fix linting issues
bun run lint:fix

# Run type checking
bun run type-check

# Run all code quality checks
bun run quality
```

### Build Commands

```bash
# Build for development
bun run build:dev

# Build for production
bun run build:prod

# Clean build artifacts
bun run clean

# Analyze bundle size
bun run analyze
```

## 📋 Script Commands

### Automated Setup

```bash
# Full setup with Docker support
./docs/scripts/setup-databases.sh

# Simplified setup without Docker
./docs/scripts/setup-databases-simple.sh

# Quick project setup
bun run setup

# Setup development environment
bun run setup:dev
```

### Maintenance Commands

```bash
# Update dependencies
bun run update

# Check for outdated packages
bun run outdated

# Audit security vulnerabilities
bun run audit

# Fix security issues
bun run audit:fix
```

## 🔍 Debugging Commands

### Logging

```bash
# Start with debug logging
DEBUG=* bun run dev

# Start with specific debug namespace
DEBUG=finanzapp:* bun run dev

# View application logs
bun run logs

# View error logs only
bun run logs:error
```

### Database Debugging

```bash
# Test database connection
bun run db:test-connection

# Verify database schema
bun run db:verify-schema

# Check database status
bun run db:status

# Reset database and run migrations
bun run db:reset
```

## 🧪 Testing Commands

### Test Execution

```bash
# Run all tests
bun run test

# Run specific test file
bun run test -- src/components/users/__tests__/user.test.ts

# Run tests matching pattern
bun run test -- --testNamePattern="User"

# Run tests in specific directory
bun run test -- src/components/budgets/

# Run tests with verbose output
bun run test -- --verbose
```

### Coverage

```bash
# Generate coverage report
bun run coverage

# Generate coverage with HTML report
bun run coverage:html

# Check coverage thresholds
bun run coverage:check

# Generate coverage badge
bun run coverage:badge
```

## 📊 Monitoring Commands

### Performance

```bash
# Start with performance monitoring
bun run dev:profile

# Generate performance report
bun run profile

# Monitor memory usage
bun run monitor:memory

# Monitor CPU usage
bun run monitor:cpu
```

### Health Checks

```bash
# Check application health
bun run health:check

# Check database health
bun run health:db

# Check all services health
bun run health:all
```

## 🚀 Deployment Commands

### Production Deployment

```bash
# Build for production
bun run build:prod

# Deploy to production
bun run deploy:prod

# Rollback deployment
bun run deploy:rollback

# Check deployment status
bun run deploy:status
```

### Staging Deployment

```bash
# Deploy to staging
bun run deploy:staging

# Test staging environment
bun run test:staging

# Promote staging to production
bun run deploy:promote
```

## 📝 Documentation Commands

### Generate Documentation

```bash
# Generate API documentation
bun run docs:generate

# Generate code documentation
bun run docs:code

# Generate database documentation
bun run docs:db

# Generate all documentation
bun run docs:all
```

### Documentation Validation

```bash
# Validate API documentation
bun run docs:validate

# Check documentation links
bun run docs:check-links

# Generate documentation site
bun run docs:build
```

## 🔧 Configuration Commands

### Environment Setup

```bash
# Copy environment template
bun run env:copy

# Validate environment variables
bun run env:validate

# Generate environment documentation
bun run env:docs
```

### Database Configuration

```bash
# Initialize database
bun run db:init

# Configure database settings
bun run db:config

# Test database configuration
bun run db:test-config
```

## 📋 Quick Reference

### Most Used Commands

```bash
# Development
bun run dev                    # Start development server
bun run test                   # Run tests
bun run build                  # Build project

# Database
bun run db:setup:local        # Setup local database
bun run prisma:migrate        # Create migration
bun run prisma:deploy         # Apply migrations

# Docker
docker compose up -d          # Start services
docker compose down           # Stop services

# Setup
./docs/scripts/setup-databases-simple.sh  # Quick setup
```

### Troubleshooting Commands

```bash
# Database issues
bun run db:test-connection    # Test database connection
bun run prisma:generate       # Regenerate Prisma client

# Environment issues
node -e "console.log(require('dotenv').config())"  # Check env vars

# Build issues
bun run clean                 # Clean build artifacts
bun run build                 # Rebuild project
```

## 🆘 Help Commands

### Get Help

```bash
# Show all available commands
bun run

# Show command help
bun run --help

# Show specific command help
bun run <command> --help
```

### Version Information

```bash
# Show Node.js version
node --version

# Show bun version
bun --version

# Show project version
bun run version

# Show all dependency versions
bun list
```

---

**Note**: All commands should be run from the project root directory. Make sure you have the required dependencies installed before running any commands.
