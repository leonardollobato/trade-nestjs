# Trading Dashboard Backend

A real-time trading dashboard backend built with NestJS using Test-Driven Development (TDD). Features WebSocket-based real-time stock tick updates, JWT authentication with RBAC, and flexible database architecture supporting both SQL and NoSQL databases.

## Features

- **Real-time Stock Ticks**: WebSocket streaming with configurable intervals
- **Multi-select Subscriptions**: Users can subscribe to specific stocks
- **Major Market Coverage**: S&P 500, NASDAQ, Dow Jones with sector categorization
- **Flexible Database**: SQLite (dev) with easy MongoDB migration
- **Robust Authentication**: JWT + RBAC with Admin role
- **Comprehensive Testing**: TDD approach with unit and integration tests
- **Developer Experience**: Devcontainer setup with debugging tools

## Project Structure

The project follows a modular architecture organized by domain:

```
src/
├── app.module.ts                    # Root module
├── main.ts                          # Application bootstrap
├── auth/                            # Authentication & Authorization
├── users/                           # User Management
├── stocks/                          # Stock Management
├── ticks/                           # Tick Data Management
├── websocket/                       # Real-time WebSocket
├── database/                        # Database Configuration
├── common/                          # Shared Components
├── config/                          # Configuration Management
└── health/                          # Health Checks
```

## Development Status

This project is under active development. Current progress:

- ✅ Project structure planning
- ✅ Basic entity definitions and interfaces
- ✅ Repository patterns defined
- ⏳ Database configuration (waiting for setup)
- ⏳ Authentication system (waiting for implementation)
- ⏳ Service implementations (pending)
- ⏳ Controller implementations (pending)
- ⏳ WebSocket implementation (pending)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (optional for NoSQL storage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

Once the server is running, access the Swagger documentation at:
http://localhost:3000/api

## License

This project is licensed under the MIT License