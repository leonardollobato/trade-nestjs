# Trading Dashboard Backend - NestJS Implementation Plan

## 🎯 Project Overview

A real-time trading dashboard backend built with NestJS using Test-Driven Development (TDD). Features WebSocket-based real-time stock tick updates, JWT authentication with RBAC, and flexible database architecture supporting both SQL and NoSQL databases.

### Key Features

- **Real-time Stock Ticks**: WebSocket streaming with configurable intervals
- **Multi-select Subscriptions**: Users can subscribe to specific stocks
- **Major Market Coverage**: S&P 500, NASDAQ, Dow Jones with sector categorization
- **Flexible Database**: SQLite (dev) with easy MongoDB migration
- **Robust Authentication**: JWT + RBAC with Admin role
- **Comprehensive Testing**: TDD approach with unit and integration tests
- **Developer Experience**: Devcontainer setup with debugging tools

## 🏗️ Architecture Overview

### Project Structure

```
src/
├── app.module.ts                    # Root module
├── main.ts                         # Application bootstrap
├── auth/                          # Authentication & Authorization
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── decorators/
│       └── roles.decorator.ts
├── users/                         # User Management
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── repositories/
│       ├── user.repository.interface.ts
│       ├── typeorm-user.repository.ts
│       └── mongoose-user.repository.ts
├── stocks/                        # Stock Management
│   ├── stocks.module.ts
│   ├── stocks.service.ts
│   ├── stocks.controller.ts
│   ├── entities/
│   │   └── stock.entity.ts
│   ├── dto/
│   │   ├── create-stock.dto.ts
│   │   ├── update-stock.dto.ts
│   │   └── stock-filter.dto.ts
│   └── repositories/
│       ├── stock.repository.interface.ts
│       ├── typeorm-stock.repository.ts
│       └── mongoose-stock.repository.ts
├── ticks/                         # Tick Data Management
│   ├── ticks.module.ts
│   ├── ticks.service.ts
│   ├── ticks.controller.ts
│   ├── entities/
│   │   └── tick.entity.ts
│   ├── dto/
│   │   ├── create-tick.dto.ts
│   │   └── tick-query.dto.ts
│   ├── repositories/
│   │   ├── tick.repository.interface.ts
│   │   ├── typeorm-tick.repository.ts
│   │   └── mongoose-tick.repository.ts
│   └── generators/
│       └── tick-generator.service.ts
├── websocket/                     # Real-time WebSocket
│   ├── websocket.module.ts
│   ├── websocket.gateway.ts
│   ├── websocket.service.ts
│   └── dto/
│       ├── subscription.dto.ts
│       └── websocket-message.dto.ts
├── database/                      # Database Configuration
│   ├── database.module.ts
│   ├── database.config.ts
│   ├── database.factory.ts
│   ├── migrations/
│   └── seeds/
│       ├── user.seed.ts
│       ├── stock.seed.ts
│       └── tick.seed.ts
├── common/                        # Shared Components
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   ├── interceptors/
│   │   └── logging.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   └── types/
│       ├── user.types.ts
│       ├── stock.types.ts
│       └── websocket.types.ts
├── config/                        # Configuration Management
│   ├── config.module.ts
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── tick-intervals.config.json
└── health/                        # Health Checks
    ├── health.module.ts
    └── health.controller.ts

test/
├── unit/                          # Unit Tests
├── integration/                   # Integration Tests
├── fixtures/                      # Test Data
└── helpers/                       # Test Utilities

.devcontainer/
├── devcontainer.json             # Development Container Config
├── Dockerfile                    # Container Setup
└── docker-compose.yml           # Services Configuration
```

## 🗄️ Database Schema Design

### TypeORM Entities (SQLite Primary)

#### User Entity

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: "simple-enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserSubscription, (subscription) => subscription.user)
  subscriptions: UserSubscription[];
}
```

#### Stock Entity

```typescript
@Entity("stocks")
export class Stock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  symbol: string;

  @Column()
  companyName: string;

  @Column()
  sector: string;

  @Column()
  index: string; // S&P 500, NASDAQ, Dow Jones

  @Column("decimal", { precision: 15, scale: 2 })
  marketCap: number;

  @Column("decimal", { precision: 15, scale: 2 })
  volumeAverage: number;

  @Column("decimal", { precision: 10, scale: 4 })
  currentPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tick, (tick) => tick.stock)
  ticks: Tick[];
}
```

#### Tick Entity

```typescript
@Entity("ticks")
export class Tick {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Stock, (stock) => stock.ticks)
  @JoinColumn({ name: "stockId" })
  stock: Stock;

  @Column()
  stockId: string;

  @Column("decimal", { precision: 10, scale: 4 })
  price: number;

  @Column("decimal", { precision: 15, scale: 2 })
  volume: number;

  @Column()
  timestamp: Date;

  @Column()
  interval: string; // 1min, 5min, 15min, 30min, 1hour, 1day

  @CreateDateColumn()
  createdAt: Date;
}
```

#### User Subscription Entity

```typescript
@Entity("user_subscriptions")
export class UserSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: "stockId" })
  stock: Stock;

  @Column()
  stockId: string;

  @Column()
  interval: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

### MongoDB Schema (Alternative)

```typescript
// Mongoose schemas with similar structure
// Implemented in mongoose-*.repository.ts files
```

## 🔧 Configuration Files

### Tick Intervals Configuration

```json
// src/config/tick-intervals.config.json
{
  "intervals": [
    {
      "value": "1min",
      "label": "1 Minute",
      "milliseconds": 60000,
      "isDefault": false
    },
    {
      "value": "5min",
      "label": "5 Minutes",
      "milliseconds": 300000,
      "isDefault": false
    },
    {
      "value": "15min",
      "label": "15 Minutes",
      "milliseconds": 900000,
      "isDefault": true
    },
    {
      "value": "30min",
      "label": "30 Minutes",
      "milliseconds": 1800000,
      "isDefault": false
    },
    {
      "value": "1hour",
      "label": "1 Hour",
      "milliseconds": 3600000,
      "isDefault": false
    },
    {
      "value": "1day",
      "label": "1 Day",
      "milliseconds": 86400000,
      "isDefault": false
    }
  ]
}
```

### Environment Configuration

```typescript
// .env
NODE_ENV=development
PORT=3000

# Database
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/trading.db
MONGODB_URI=mongodb://localhost:27017/trading

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## 🔐 API Endpoints Specification

### Authentication Endpoints

```typescript
POST / auth / login;
POST / auth / register;
POST / auth / refresh;
POST / auth / logout;
GET / auth / profile;
```

### User Management (Admin only)

```typescript
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
GET    /users/:id/subscriptions
POST   /users/:id/subscriptions
DELETE /users/:id/subscriptions/:subscriptionId
```

### Stock Management

```typescript
GET    /stocks                    # Query params: sector, index, search
GET    /stocks/:id
POST   /stocks                    # Admin only
PUT    /stocks/:id                # Admin only
DELETE /stocks/:id                # Admin only
GET    /stocks/sectors
GET    /stocks/indices
```

### Tick Data

```typescript
GET    /ticks                     # Query params: stockId, interval, from, to
GET    /ticks/:stockId/latest
GET    /ticks/:stockId/history    # Query params: interval, days
```

### Configuration

```typescript
GET    /config/intervals
PUT    /config/intervals          # Admin only
```

### Health Check

```typescript
GET / health;
GET / health / database;
```

## 🔌 WebSocket Events Specification

### Client → Server Events

```typescript
interface SubscriptionMessage {
  event: "subscribe" | "unsubscribe";
  stockIds: string[];
  interval: string;
}

interface ConnectionMessage {
  event: "connect";
  token: string; // JWT token
}
```

### Server → Client Events

```typescript
interface TickUpdateMessage {
  event: "tick-update";
  data: {
    stockId: string;
    symbol: string;
    price: number;
    volume: number;
    timestamp: Date;
    interval: string;
  };
}

interface StockListMessage {
  event: "stock-list";
  data: Stock[];
}

interface SubscriptionUpdateMessage {
  event: "subscription-update";
  data: {
    subscribed: string[];
    unsubscribed: string[];
  };
}

interface ConnectionStatusMessage {
  event: "connection-status";
  data: {
    connected: boolean;
    userId: string;
    connectionId: string;
  };
}
```

## 🧪 TDD Implementation Plan

### Phase 1: Authentication & Authorization (Week 1)

#### Step 1.1: Auth Module Tests

```typescript
// test/unit/auth/auth.service.spec.ts
describe("AuthService", () => {
  // Test user registration
  // Test user login
  // Test JWT token generation
  // Test password hashing
  // Test token validation
});

// test/unit/auth/guards/jwt-auth.guard.spec.ts
describe("JwtAuthGuard", () => {
  // Test valid token access
  // Test invalid token rejection
  // Test missing token rejection
});

// test/unit/auth/guards/roles.guard.spec.ts
describe("RolesGuard", () => {
  // Test admin role access
  // Test unauthorized role rejection
  // Test role hierarchy
});
```

#### Step 1.2: Auth Implementation

- Implement `AuthService` with bcrypt password hashing
- Create JWT strategy and guards
- Implement role-based access control
- Add user registration and login endpoints

#### Step 1.3: Integration Tests

```typescript
// test/integration/auth.e2e-spec.ts
describe("Auth (e2e)", () => {
  // Test complete registration flow
  // Test login with correct credentials
  // Test protected route access
  // Test admin-only route protection
});
```

### Phase 2: User Management (Week 1-2)

#### Step 2.1: User Module Tests

```typescript
// test/unit/users/users.service.spec.ts
describe("UsersService", () => {
  // Test user CRUD operations
  // Test user subscription management
  // Test user search and filtering
});

// test/unit/users/repositories/user.repository.spec.ts
describe("UserRepository", () => {
  // Test TypeORM repository operations
  // Test MongoDB repository operations
  // Test repository interface compliance
});
```

#### Step 2.2: User Implementation

- Create user entity and DTOs
- Implement abstract repository pattern
- Create TypeORM and MongoDB repositories
- Build user service and controller

### Phase 3: Stock Management (Week 2)

#### Step 3.1: Stock Module Tests

```typescript
// test/unit/stocks/stocks.service.spec.ts
describe("StocksService", () => {
  // Test stock CRUD operations
  // Test sector filtering
  // Test index categorization
  // Test stock search functionality
});
```

#### Step 3.2: Stock Implementation

- Create stock entity with sector categorization
- Implement dual repository pattern
- Build stock management endpoints
- Create stock filtering and search

### Phase 4: Tick Data & Generation (Week 2-3)

#### Step 4.1: Tick Module Tests

```typescript
// test/unit/ticks/ticks.service.spec.ts
describe("TicksService", () => {
  // Test tick data storage
  // Test historical data retrieval
  // Test tick generation logic
});

// test/unit/ticks/generators/tick-generator.service.spec.ts
describe("TickGeneratorService", () => {
  // Test realistic price generation
  // Test interval-based generation
  // Test volume calculation
});
```

#### Step 4.2: Tick Implementation

- Create tick entity and repositories
- Implement tick generator service
- Build historical data seeding
- Create tick data API endpoints

### Phase 5: WebSocket Real-time Features (Week 3)

#### Step 5.1: WebSocket Tests

```typescript
// test/unit/websocket/websocket.gateway.spec.ts
describe("WebSocketGateway", () => {
  // Test client connection handling
  // Test subscription management
  // Test real-time tick broadcasting
  // Test user authentication via WebSocket
});
```

#### Step 5.2: WebSocket Implementation

- Create WebSocket gateway with JWT auth
- Implement subscription management
- Build real-time tick broadcasting
- Add connection status tracking

### Phase 6: Integration & E2E Tests (Week 3-4)

#### Step 6.1: Full System Integration

```typescript
// test/integration/trading-flow.e2e-spec.ts
describe("Trading Flow (e2e)", () => {
  // Test complete user journey
  // Test real-time data flow
  // Test database switching
  // Test concurrent user handling
});
```

## 🏭 Seed Data Specification

### Sample Stocks Data (Major Indices)

```typescript
// Database seed data structure
const sampleStocks = [
  // Technology Sector - NASDAQ
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    sector: "Technology",
    index: "NASDAQ",
    marketCap: 2800000000000,
    volumeAverage: 57000000,
    currentPrice: 175.5,
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    sector: "Technology",
    index: "NASDAQ",
    marketCap: 1700000000000,
    volumeAverage: 25000000,
    currentPrice: 135.2,
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    sector: "Technology",
    index: "NASDAQ",
    marketCap: 2400000000000,
    volumeAverage: 32000000,
    currentPrice: 325.8,
  },

  // Financial Sector - S&P 500
  {
    symbol: "JPM",
    companyName: "JPMorgan Chase & Co.",
    sector: "Finance",
    index: "S&P 500",
    marketCap: 450000000000,
    volumeAverage: 15000000,
    currentPrice: 155.9,
  },
  {
    symbol: "BAC",
    companyName: "Bank of America Corp",
    sector: "Finance",
    index: "S&P 500",
    marketCap: 280000000000,
    volumeAverage: 42000000,
    currentPrice: 34.5,
  },

  // Healthcare Sector
  {
    symbol: "JNJ",
    companyName: "Johnson & Johnson",
    sector: "Healthcare",
    index: "Dow Jones",
    marketCap: 420000000000,
    volumeAverage: 8000000,
    currentPrice: 165.3,
  },

  // Energy Sector
  {
    symbol: "XOM",
    companyName: "Exxon Mobil Corporation",
    sector: "Energy",
    index: "Dow Jones",
    marketCap: 450000000000,
    volumeAverage: 18000000,
    currentPrice: 110.75,
  },

  // Consumer Sector
  {
    symbol: "AMZN",
    companyName: "Amazon.com Inc.",
    sector: "Consumer",
    index: "NASDAQ",
    marketCap: 1500000000000,
    volumeAverage: 35000000,
    currentPrice: 145.6,
  },

  // Industrial Sector
  {
    symbol: "GE",
    companyName: "General Electric Company",
    sector: "Industrial",
    index: "S&P 500",
    marketCap: 120000000000,
    volumeAverage: 55000000,
    currentPrice: 110.2,
  },
];

// 150 days of historical data generation
// Generate realistic price movements with:
// - Daily volatility between 0.5% - 3%
// - Volume variations
// - Market trends and patterns
```

## 🛠️ Development Environment Setup

### Devcontainer Configuration

```json
// .devcontainer/devcontainer.json
{
  "name": "Trading Dashboard Backend",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash",
    "typescript.preferences.importModuleSpecifier": "relative"
  },
  "extensions": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-eslint"
  ],
  "postCreateCommand": "npm install",
  "remoteUser": "node"
}
```

```yaml
# .devcontainer/docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ../..:/workspace:cached
    command: sleep infinity
    ports:
      - "3000:3000"
      - "9229:9229" # Debug port
    environment:
      - NODE_ENV=development
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=trading
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

```dockerfile
# .devcontainer/Dockerfile
FROM node:18-alpine

WORKDIR /workspace

# Install global dependencies
RUN npm install -g @nestjs/cli

# Install SQLite for local development
RUN apk add --no-cache sqlite

USER node
```

### VS Code Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 🔒 Security Implementation Checklist

### Input Validation & Sanitization

- [ ] Class-validator for all DTOs
- [ ] Sanitization of user inputs
- [ ] SQL injection prevention
- [ ] XSS protection

### Authentication & Authorization

- [ ] JWT token security (secret rotation)
- [ ] Password hashing with bcrypt
- [ ] Role-based access control
- [ ] Session management

### API Security

- [ ] CORS configuration
- [ ] Helmet security headers
- [ ] Request size limits
- [ ] Input validation middleware

### Database Security

- [ ] Database connection encryption
- [ ] Query parameterization
- [ ] Access control
- [ ] Audit logging

### WebSocket Security

- [ ] JWT authentication for WebSocket connections
- [ ] Connection rate limiting
- [ ] Message validation
- [ ] Secure WebSocket configuration

## 📋 Implementation Checklist

### Setup Phase

- [ ] Initialize NestJS project
- [ ] Configure devcontainer
- [ ] Set up database connections (SQLite + MongoDB)
- [ ] Configure testing environment
- [ ] Set up CI/CD pipeline basics

### Authentication Phase

- [ ] Create User entity and repository
- [ ] Implement JWT authentication
- [ ] Create role-based guards
- [ ] Write authentication tests
- [ ] Implement auth endpoints

### Stock Management Phase

- [ ] Create Stock entity and repository
- [ ] Implement dual database support
- [ ] Create stock CRUD operations
- [ ] Add sector/index filtering
- [ ] Seed sample stock data

### Tick Data Phase

- [ ] Create Tick entity and repository
- [ ] Implement tick generator service
- [ ] Create historical data seeding
- [ ] Build tick API endpoints
- [ ] Add configurable intervals

### WebSocket Phase

- [ ] Implement WebSocket gateway
- [ ] Add JWT authentication for WebSocket
- [ ] Create subscription management
- [ ] Implement real-time broadcasting
- [ ] Add connection tracking

### Integration Phase

- [ ] Write integration tests
- [ ] Test database switching
- [ ] Performance testing
- [ ] Security testing
- [ ] Documentation completion

### Documentation Phase

- [ ] Complete Swagger documentation
- [ ] Write API usage examples
- [ ] Create deployment guide
- [ ] Add troubleshooting guide

## 🚀 Getting Started

1. **Clone and Setup**

   ```bash
   git clone <repository>
   cd trade-nestjs
   code . # Opens in VS Code with devcontainer
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment**

   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Run Database Migrations**

   ```bash
   npm run migration:run
   ```

5. **Seed Sample Data**

   ```bash
   npm run seed:run
   ```

6. **Start Development Server**

   ```bash
   npm run start:dev
   ```

7. **Run Tests**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # Integration tests
   npm run test:cov    # Coverage report
   ```

## 🎯 Success Metrics

- [ ] All tests passing (90%+ coverage)
- [ ] Support for 100 concurrent WebSocket connections
- [ ] Real-time tick updates with <100ms latency
- [ ] Database switching working seamlessly
- [ ] Complete API documentation
- [ ] Security best practices implemented
- [ ] TDD approach maintained throughout

---

This plan provides a comprehensive roadmap for building a robust, scalable, and secure trading dashboard backend using NestJS with TDD methodology. Each phase builds upon the previous, ensuring a solid foundation and maintainable codebase.
