# Troubleshooting Guide - FinanzApp

This guide helps you resolve common issues when working with FinanzApp.

## 🔍 Quick Diagnosis

### Check Application Status

```bash
# Check if the application is running
curl http://localhost:3000/health

# Check if MySQL is running
docker compose ps

# Check environment variables
node -e "console.log(require('dotenv').config())"
```

## 🚨 Common Issues

### 1. **Application Won't Start**

#### Symptoms

- Error: "Cannot find module"
- Error: "Port already in use"
- Application crashes on startup

#### Solutions

**Missing Dependencies**

```bash
# Install dependencies
bun install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
bun install
```

**Port Already in Use**

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 bun run dev
```

**Environment Variables Missing**

```bash
# Check if .env files exist
ls -la .env*

# Copy environment template
cp .env.example .env.local

# Verify environment variables
node -e "console.log(require('dotenv').config())"
```

### 2. **Database Connection Issues**

#### Symptoms

- Error: "Can't reach database server"
- Error: "Authentication failed"
- Error: "Database doesn't exist"

#### Solutions

**MySQL Not Running**

```bash
# Start MySQL with Docker
docker compose up -d finanzapp-db

# Wait for MySQL to be ready
sleep 10

# Verify MySQL is running
docker compose ps
```

**Wrong Credentials**

```bash
# Test connection with correct credentials
mysql -u user -ppassword -h localhost -P 3307 -e "SELECT 1;"

# Update .env files with correct credentials
# Check .env.local, .env.test, and .env files
```

**Database Doesn't Exist**

```bash
# Create databases manually
mysql -u user -ppassword -h localhost -P 3307 -e "
CREATE DATABASE IF NOT EXISTS \`finanzapp-local\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp-test\`;
CREATE DATABASE IF NOT EXISTS \`finanzapp\`;
"
```

**Wrong Port**

```bash
# Check if MySQL is running on the correct port
netstat -tlnp | grep 3307

# Update DATABASE_URL in .env files
# Should be: mysql://user:password@localhost:3307/database_name
```

### 3. **Migration Issues**

#### Symptoms

- Error: "Migration failed"
- Error: "Schema is out of sync"
- Error: "Prisma client not generated"

#### Solutions

**Regenerate Prisma Client**

```bash
# Generate Prisma client
bun run prisma:generate

# Or manually
npx prisma generate
```

**Reset Database and Migrations**

```bash
# Reset local database
bun run db:reset:local

# Apply migrations
bun run prisma:deploy:local

# Or manually
npx prisma migrate reset
npx prisma migrate deploy
```

**Schema Out of Sync**

```bash
# Pull latest schema from database
npx prisma db pull

# Generate client
npx prisma generate

# Apply migrations
npx prisma migrate deploy
```

### 4. **Test Failures**

#### Symptoms

- Tests fail with database errors
- Tests fail with connection issues
- Tests timeout
- Mock errors with Bun

#### Solutions

**Test Database Not Set Up**

```bash
# Setup test database
bun run db:setup:test

# Or run the setup script
./docs/scripts/setup-databases-simple.sh
```

**Test Environment Variables**

```bash
# Check test environment
cat .env.test

# Verify test database connection
npx prisma db pull --schema=./prisma/schema.prisma
```

**Clean Test Database**

```bash
# Reset test database
bun run db:reset:test

# Re-run tests
bun run test
```

**Bun Testing Issues**

```bash
# Run tests with Bun
bun test

# Run specific test file
bun test src/components/users/__tests__/controllers/UserController.test.ts
```

**Mock Issues with Bun**

Bun uses its own mocking system and doesn't support `jest.mock()`. For mocking in Bun:

```typescript
// ❌ This doesn't work in Bun
jest.mock('bcrypt');

// ✅ Use Bun's mocking approach
import { mock } from 'bun:test';

// Or test actual behavior without mocks
const result = await user.isPasswordValid('password');
expect(typeof result).toBe('boolean');
```

### 5. **Docker Issues**

#### Symptoms

- Docker containers won't start
- Port conflicts
- Volume mounting issues

#### Solutions

**Port Conflicts**

```bash
# Check what's using the ports
lsof -i :3307
lsof -i :3000

# Stop conflicting services
docker compose down

# Start with different ports
DOCKER_PORT=3001 DB_PORT=3308 docker compose up
```

**Volume Issues**

```bash
# Remove old volumes
docker compose down -v

# Recreate volumes
docker compose up -d
```

**Container Won't Start**

```bash
# Check container logs
docker compose logs finanzapp-db

# Restart containers
docker compose restart

# Rebuild containers
docker compose up --build
```

### 6. **Build Issues**

#### Symptoms

- TypeScript compilation errors
- Build fails
- Missing type definitions

#### Solutions

**TypeScript Errors**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix type issues
bun run type-check

# Update TypeScript
bun install typescript@latest
```

**Missing Types**

```bash
# Install missing type definitions
bun install @types/node @types/express

# Or install all dev dependencies
bun install --save-dev
```

**Build Cache Issues**

```bash
# Clean build artifacts
bun run clean

# Or manually
rm -rf build dist

# Rebuild
bun run build
```

## 🔧 Environment Issues

### Environment Variables

**Check Environment Files**

```bash
# List all environment files
ls -la .env*

# Verify environment variables are loaded
node -e "
const dotenv = require('dotenv');
console.log('Local:', dotenv.config({ path: '.env.local' }));
console.log('Test:', dotenv.config({ path: '.env.test' }));
console.log('Production:', dotenv.config({ path: '.env' }));
"
```

**Common Environment Issues**

```bash
# Missing DATABASE_URL
echo "DATABASE_URL=\"mysql://user:password@localhost:3307/finanzapp-local\"" >> .env.local

# Missing NODE_ENV
echo "NODE_ENV=\"local\"" >> .env.local

# Missing JWT_SECRET_KEY
echo "JWT_SECRET_KEY=\"your-secret-key\"" >> .env.local
```

## 🧪 Testing Issues

### Test Database Setup

**Setup Test Environment**

```bash
# Create test database
mysql -u user -ppassword -h localhost -P 3307 -e "CREATE DATABASE IF NOT EXISTS \`finanzapp-test\`;"

# Run migrations on test database
bun run prisma:deploy-test

# Verify test setup
bun run test
```

**Test Data Issues**

```bash
# Reset test database
bun run db:reset:test

# Seed test data
bun run db:seed

# Run tests
bun run test
```

## 📊 Performance Issues

### Slow Database Queries

**Check Database Performance**

```bash
# Enable query logging
DEBUG=prisma:query bun run dev

# Check database indexes
npx prisma db pull

# Analyze slow queries
mysql -u user -ppassword -h localhost -P 3307 -e "SHOW PROCESSLIST;"
```

### Memory Issues

**Check Memory Usage**

```bash
# Monitor memory usage
bun run monitor:memory

# Check for memory leaks
node --inspect bun run dev

# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun run dev
```

## 🔍 Debugging Commands

### Application Debugging

```bash
# Start with debug logging
DEBUG=* bun run dev

# Start with specific debug namespace
DEBUG=finanzapp:* bun run dev

# Check application logs
bun run logs
```

### Database Debugging

```bash
# Test database connection
bun run db:test-connection

# Check database schema
npx prisma db pull

# Verify migrations
npx prisma migrate status
```

### Network Debugging

```bash
# Check if ports are open
netstat -tlnp | grep :3000
netstat -tlnp | grep :3307

# Test API endpoints
curl -v http://localhost:3000/health

# Check CORS issues
curl -H "Origin: http://localhost:3000" -v http://localhost:3000/api/v1/users
```

## 📋 Verification Checklist

### Before Reporting an Issue

- [ ] Checked the application logs
- [ ] Verified environment variables
- [ ] Tested database connection
- [ ] Confirmed all dependencies are installed
- [ ] Checked if the issue is in the documentation
- [ ] Tried the troubleshooting steps above

### Common Verification Commands

```bash
# Verify setup
bun run dev
bun run test
bun run build

# Verify database
bun run db:setup:local
bun run db:setup:test

# Verify environment
node -e "console.log(require('dotenv').config())"
```

## 🆘 Getting Help

### Before Asking for Help

1. **Check the logs**: Look at application and database logs
2. **Verify setup**: Run the verification checklist above
3. **Search existing issues**: Check if someone else had the same problem
4. **Provide details**: Include error messages, environment, and steps to reproduce

### Where to Get Help

- **Documentation**: Check [Setup Instructions](./setup/SETUP_INSTRUCTIONS.md)
- **Database Issues**: See [Database Configuration](./database/DATABASE_SETUP.md)
- **Command Reference**: Check [Commands](./commands.md)
- **Knowledge Base**: Review [Knowledge Base](./knowledge.md)

### Information to Include

- **Error message**: Copy the exact error
- **Environment**: OS, Node.js version, bun version
- **Steps to reproduce**: What you did before the error
- **Expected behavior**: What should have happened
- **Actual behavior**: What actually happened

---

**Remember**: Most issues can be resolved by following the troubleshooting steps above. If you're still having problems, make sure to provide all the necessary information when asking for help.
