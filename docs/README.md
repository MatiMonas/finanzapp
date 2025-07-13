# Documentation - FinanzApp

Complete documentation for the FinanzApp project, organized by category for easy navigation.

## 🎯 Quick Navigation

### 🚀 **Getting Started**

- [Project Setup Guide](./setup/PROJECT_SETUP.md) - Complete setup and configuration
- [API Documentation](./endpoints/) - All available endpoints

### 📊 **Database & Configuration**

- [Database Setup](./setup/PROJECT_SETUP.md#-database-configuration) - Database configuration guide
- [Environment Setup](./setup/PROJECT_SETUP.md#-environment-setup) - Environment files configuration
- [Setup Scripts](./scripts/) - Automated setup tools

### 🔧 **Development & Testing**

- [Development Setup](./setup/PROJECT_SETUP.md#-development-setup) - Development environment
- [Testing Guide](./development/testing.md) - Complete testing guide with Bun vs Jest differences
- [Testing Configuration](./setup/PROJECT_SETUP.md#-testing-configuration) - Test setup and commands
- [Troubleshooting](./development/troubleshooting.md) - Common issues and solutions
- [Development Commands](./development/commands.md) - Available development commands

### 📚 **API Reference**

- [Users Endpoints](./endpoints/users.md) - User management API
- [Budgets Endpoints](./endpoints/budgets.md) - Budget management API
- [Wages Endpoints](./endpoints/wages.md) - Wage management API
- [Swagger Documentation](./reference/swagger.json) - Complete API specification
- [Knowledge Base](./reference/knowledge.md) - Project knowledge and concepts

---

## 📁 Documentation Structure

```
docs/
├── README.md                    # This file - main documentation index
├── development/                 # Development guides and tools
│   ├── testing.md              # Complete testing guide with Bun vs Jest
│   ├── troubleshooting.md      # Common issues and solutions
│   └── commands.md             # Available development commands
├── reference/                   # API and technical reference
│   ├── knowledge.md            # Project knowledge and concepts
│   └── swagger.json            # Complete API specification
├── setup/                      # Setup and configuration
│   └── PROJECT_SETUP.md        # Complete setup and configuration guide
├── endpoints/                   # API endpoint documentation
│   ├── README.md               # API documentation index
│   ├── users.md                # Users component endpoints
│   ├── budgets.md              # Budgets component endpoints
│   └── wages.md                # Wages component endpoints
└── scripts/                    # Setup and utility scripts
    └── setup-databases-simple.sh # Database setup script
```

---

## 🚀 Quick Start

### 1. First Time Setup

```bash
# Clone and install
git clone <repository-url>
cd finanzapp
bun install

# Setup databases
./docs/scripts/setup-databases-simple.sh

# Start development
bun run dev
```

### 2. Development Commands

```bash
bun run dev          # Local development (uses finanzapp-local)
bun run dev:prod     # Development with production DB
bun run test         # Tests (uses finanzapp-test)
bun run coverage     # Tests with coverage
```

### 3. Database Setup

```bash
# Automated setup
./docs/scripts/setup-databases-simple.sh

# Manual setup
bun run db:setup:local
bun run db:setup:test
bun run db:setup:prod
```

---

## 📊 Database Configuration

The project uses three database environments:

| Environment    | Database          | Configuration | Usage                  |
| -------------- | ----------------- | ------------- | ---------------------- |
| **Local**      | `finanzapp-local` | `.env.local`  | Daily development      |
| **Test**       | `finanzapp-test`  | `.env.test`   | Automated tests        |
| **Production** | `finanzapp`       | `.env`        | Production environment |

**Configuration:**

- **Host**: localhost
- **Port**: 3306
- **User**: user
- **Password**: password

---

## 🔧 Environment Files

### `.env.local` (Local Development)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp-local"
NODE_ENV="local"
PORT=3000
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
```

### `.env.test` (Tests)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp-test"
```

### `.env` (Production)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp"
NODE_ENV="production"
PORT=3000
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
```

---

## 🐳 Docker Support

```bash
# Start only the database
docker compose up -d finanzapp-db

# Start complete application
docker compose up
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. MySQL connection error

```bash
# Check if MySQL is running
net start | findstr MySQL

# Verify connection
mysql -u user -ppassword -h localhost -P 3306 -e "SELECT 1;"
```

#### 2. Database doesn't exist

```bash
# Create databases manually
mysql -u user -ppassword -h localhost -P 3306 -e "
CREATE DATABASE IF NOT EXISTS \`finanzapp-local\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp-test\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp\`;
"
```

#### 3. Migration error

```bash
# Regenerate Prisma client
bun run prisma:generate

# Apply migrations manually
bunx prisma migrate deploy
```

### Verify Configuration

```bash
# Verify local database connection
bunx prisma db pull --schema=./prisma/schema.prisma

# Verify environment variables
node -e "console.log(require('dotenv').config())"
```

---

## ✅ Setup Checklist

- [ ] MySQL running on port 3306
- [ ] Database `finanzapp-local` exists
- [ ] Database `finanzapp-test` exists
- [ ] Database `finanzapp` exists
- [ ] `.env.local` file configured
- [ ] `.env.test` file configured
- [ ] `.env` file configured
- [ ] Migrations applied to all databases
- [ ] `bun run dev` works without errors
- [ ] `bun run test` works without errors

---

## 📚 Additional Resources

- [Project Setup Guide](./setup/PROJECT_SETUP.md) - Complete setup instructions
- [API Documentation](./endpoints/) - All available endpoints
- [Database Schema](../prisma/schema.prisma) - Database structure
- [Package.json](../package.json) - Available scripts and dependencies

---

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Review the complete [Project Setup Guide](./setup/PROJECT_SETUP.md)**
3. **Verify your MySQL installation and configuration**
4. **Ensure all environment files are properly configured**
