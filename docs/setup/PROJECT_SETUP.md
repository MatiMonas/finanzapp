# Project Setup Guide - FinanzApp

Complete guide for setting up and configuring the FinanzApp project.

## 🎯 Quick Navigation

- [Database Configuration](#-database-configuration)
- [Environment Setup](#-environment-setup)
- [Development Setup](#-development-setup)
- [Testing Configuration](#-testing-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 📊 Database Configuration

### Database Environments

The project uses three different database environments:

| Environment    | Database          | Configuration | Usage                  |
| -------------- | ----------------- | ------------- | ---------------------- |
| **Local**      | `finanzapp-local` | `.env.local`  | Daily development      |
| **Test**       | `finanzapp-test`  | `.env.test`   | Automated tests        |
| **Production** | `finanzapp`       | `.env`        | Production environment |

### Database Setup

#### Option 1: Automatic Setup (Recommended)

```bash
# Run the automatic setup script
./docs/scripts/setup-databases-simple.sh
```

#### Option 2: Manual Setup

1. **Start MySQL** (if using Docker):

   ```bash
   docker compose up -d finanzapp-db
   ```

2. **Create databases**:

   ```bash
   mysql -u user -ppassword -h localhost -P 3306 -e "
   CREATE DATABASE IF NOT EXISTS \`finanzapp-local\`;
   CREATE DATABASE IF NOT EXISTS \`finanzapp-test\`;
   CREATE DATABASE IF NOT EXISTS \`finanzapp\`;
   "
   ```

3. **Run migrations**:
   ```bash
   bun run db:setup:local
   bun run db:setup:test
   bun run db:setup:prod
   ```

### Database Commands

```bash
# Setup databases
bun run db:setup:local    # Setup local DB
bun run db:setup:test     # Setup test DB
bun run db:setup:prod     # Setup production DB

# Migrations
bun run prisma:migrate        # Create migration for local
bun run prisma:migrate:prod   # Create migration for production
bun run prisma:deploy         # Apply migrations to production
bun run prisma:deploy:local   # Apply migrations to local
bun run prisma:deploy-test    # Apply migrations to test
```

---

## 🔧 Environment Setup

### Environment Files

#### `.env.local` (Local Development)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp-local"
NODE_ENV="local"
PORT=3000
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
```

#### `.env.test` (Tests)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp-test"
```

#### `.env` (Production)

```env
DATABASE_URL="mysql://user:password@localhost:3306/finanzapp"
NODE_ENV="production"
PORT=3000
JWT_SECRET_KEY="your-super-secret-jwt-key-change-this-in-production"
```

### MySQL Configuration

- **Host**: localhost
- **Port**: 3306
- **User**: user
- **Password**: password
- **Databases**: finanzapp-local, finanzapp-test, finanzapp

---

## 🚀 Development Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MySQL** (running on port 3306)
3. **Git**

### Installation Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd finanzapp
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Setup databases**:

   ```bash
   ./docs/scripts/setup-databases-simple.sh
   ```

4. **Start development server**:
   ```bash
   bun run dev
   ```

### Development Commands

```bash
# Development
bun run dev          # Local development (uses finanzapp-local)
bun run dev:prod     # Development with production DB

# Building
bun run build        # Build for production
bun run start        # Start production server
```

---

## 🧪 Testing Configuration

### Test Setup

Tests automatically use the `finanzapp-test` database and run in isolated mode to avoid conflicts.

### Test Commands

```bash
# Run tests
bun run test         # Unit tests
bun run coverage     # Tests with coverage
```

### Test Configuration

- **Database**: `finanzapp-test`
- **Mode**: Isolated (each test cleans the database)
- **Coverage**: Available with `bun run coverage`

---

## 🐳 Docker Support

### Start with Docker

```bash
# Start only the database
docker compose up -d finanzapp-db

# Start complete application
docker compose up
```

### Docker Configuration

The `docker-compose.yml` is configured to:

- Use `finanzapp-local` database by default
- Mount environment files
- Expose port 3306 for MySQL

---

## 🔍 Troubleshooting

### Common Issues

#### 1. MySQL Connection Error

```bash
# Check if MySQL is running
net start | findstr MySQL

# Verify connection
mysql -u user -ppassword -h localhost -P 3306 -e "SELECT 1;"
```

#### 2. Database Doesn't Exist

```bash
# Create databases manually
mysql -u user -ppassword -h localhost -P 3306 -e "
CREATE DATABASE IF NOT EXISTS \`finanzapp-local\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp-test\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp\`;
"
```

#### 3. Migration Errors

```bash
# Regenerate Prisma client
bun run prisma:generate

# Apply migrations manually
bunx prisma migrate deploy
```

#### 4. Environment Variables Issues

```bash
# Verify environment variables
node -e "console.log(require('dotenv').config())"
```

### Verification Commands

```bash
# Verify MySQL connection
mysql -u user -ppassword -h localhost -P 3306 -e "SELECT 1;"

# Verify databases
mysql -u user -ppassword -h localhost -P 3306 -e "SHOW DATABASES;"

# Verify Prisma connection
bunx prisma db pull --schema=./prisma/schema.prisma
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

- [API Documentation](./endpoints/) - Complete endpoint documentation
- [Database Schema](../prisma/schema.prisma) - Database structure
- [Package.json](../package.json) - Available scripts and dependencies

---

## 🆘 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Verify your MySQL installation and configuration**
3. **Ensure all environment files are properly configured**
4. **Check the project's GitHub issues for known problems**
