#!/bin/bash

echo "🚀 المستشار AI - Startup Script"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check PostgreSQL
echo -e "\n${YELLOW}[1/5] Checking PostgreSQL...${NC}"
if pgrep -x "postgres" > /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠ Starting PostgreSQL...${NC}"
    sudo service postgresql start || echo -e "${RED}✗ Failed to start PostgreSQL${NC}"
fi

# Check Node.js
echo -e "\n${YELLOW}[2/5] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check .env file
echo -e "\n${YELLOW}[3/5] Checking environment file...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ Creating .env from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created (edit with your values)${NC}"
else
    echo -e "${GREEN}✓ .env exists${NC}"
fi

# Install dependencies
echo -e "\n${YELLOW}[4/5] Installing dependencies...${NC}"
cd server
if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
cd ..

# Start server
echo -e "\n${YELLOW}[5/5] Starting server...${NC}"
echo -e "${GREEN}✓ Server starting on http://localhost:3000/client/index.html${NC}"
echo -e "${YELLOW}Default credentials:${NC}"
echo -e "  Email: admin@almustasharai.com"
echo -e "  Password: Admin@123456"
echo ""

cd server && npm start
