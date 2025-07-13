#!/bin/bash

echo "🚀 Setting up databases for FinanzApp (simplified version)..."
echo "📁 Script location: docs/scripts/setup-databases-simple.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# MySQL path for Windows
MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Function to show messages
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if MySQL is running
check_mysql() {
    if ! "$MYSQL_PATH" -u user -ppassword -h localhost -P 3306 -e "SELECT 1;" >/dev/null 2>&1; then
        print_error "MySQL is not accessible. Please check:"
        echo "   1. MySQL is running on port 3306"
        echo "   2. User 'user' with password 'password' exists"
        echo "   3. Databases are created"
        exit 1
    fi
    print_status "MySQL connection verified"
}

# Main function
main() {
    echo "📋 Setting up database environments..."
    echo ""
    
    # Check MySQL connection
    check_mysql
    echo ""
    
    # Setup local database
    print_status "Setting up LOCAL database (finanzapp-local)..."
    npm run db:setup:local
    echo ""
    
    # Setup test database
    print_status "Setting up TEST database (finanzapp-test)..."
    npm run db:setup:test
    echo ""
    
    # Setup production database
    print_status "Setting up PRODUCTION database (finanzapp)..."
    npm run db:setup:prod
    echo ""
    
    print_status "🎉 Setup completed!"
    echo ""
    echo "📊 Database summary:"
    echo "   • LOCAL: finanzapp-local (port 3306)"
    echo "   • TEST: finanzapp-test (port 3306)"
    echo "   • PRODUCTION: finanzapp (port 3306)"
    echo ""
    echo "🚀 Available commands:"
    echo "   • npm run dev          - Local development (uses finanzapp-local)"
    echo "   • npm run dev:prod     - Development with production DB"
    echo "   • npm run test         - Tests (uses finanzapp-test)"
    echo "   • npm run db:setup:local  - Setup local DB"
    echo "   • npm run db:setup:test   - Setup test DB"
    echo "   • npm run db:setup:prod   - Setup production DB"
    echo ""
    print_warning "If you encounter connection errors, make sure:"
    echo "   1. MySQL is running on port 3306"
    echo "   2. Credentials in .env files are correct"
    echo "   3. Databases exist in your MySQL server"
}

# Run main function
main 