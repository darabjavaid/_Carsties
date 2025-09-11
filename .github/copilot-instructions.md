# AI Agent Instructions for Carsties

This document provides essential context for AI agents working in the Carsties codebase.

## Architecture Overview

Carsties is a microservices-based auction platform built with .NET and Next.js. Key components:

- **Auction Service** (C#/.NET): Core service handling auction creation and management
  - Uses PostgreSQL for auction data storage
  - Implements outbox pattern with MassTransit/RabbitMQ for reliable event publishing
  - Location: `src/AuctionService`

- **Search Service** (C#/.NET): Handles search functionality
  - Uses MongoDB for search index
  - Consumes auction events to maintain search data
  - Location: `src/SearchService`

- **Identity Service** (C#/.NET): Authentication/authorization using Duende IdentityServer
  - PostgreSQL for user data
  - Configures OpenID Connect/OAuth2 flows
  - Location: `src/IdentityService`

- **Gateway Service** (C#/.NET): API Gateway 
  - Handles routing and aggregation
  - Location: `src/GatewayService`

- **Frontend** (Next.js/React): Web application
  - Authentication via NextAuth.js
  - React components with Flowbite UI library
  - Global state management using Zustand
  - Location: `frontend/web-app`

## Key Patterns & Conventions

1. **Event-Driven Communication**:
   - Services communicate asynchronously via RabbitMQ
   - Events defined in `src/Contracts`
   - Consumers follow naming convention `{EventName}Consumer.cs`

2. **Data Consistency**:
   - Outbox pattern used for reliable event publishing
   - Entity Framework Core for PostgreSQL data access
   - MongoDB for read models in Search Service

3. **Authentication Flow**:
   - Identity Server issues JWT tokens
   - Services validate tokens using `JwtBearer` authentication
   - Frontend uses NextAuth.js for session management

## Development Workflow

1. **Local Development**:
```bash
# Start infrastructure services
docker compose up postgres mongodb rabbitmq

# Start microservices
docker compose up auction-svc search-svc identity-svc gateway-svc

# Start frontend (from frontend/web-app)
npm run dev
```

2. **Service Updates**:
```bash
# Rebuild specific service
docker compose build search-svc
docker compose up -d search-svc
```

3. **Database Updates**:
```bash
# Add new migration (from service directory)
dotnet ef migrations add "MigrationName"
```

## Integration Points

1. **Service URLs (Docker)**:
   - Identity Service: http://localhost:5001
   - Gateway: http://localhost:6001
   - Auction Service: http://localhost:7001
   - Search Service: http://localhost:7002

2. **Message Broker**:
   - RabbitMQ Management: http://localhost:15672
   - Default credentials: guest/guest

3. **Databases**:
   - PostgreSQL: localhost:5432
   - MongoDB: localhost:27017

## Common Tasks

1. **Adding New Auction Events**:
   - Define event contract in `src/Contracts`
   - Implement consumer in relevant service
   - Add mapping profile if needed
   - Update producer service to publish event

2. **Frontend Feature Development**:
   - Components go in `frontend/web-app/app/components`
   - New pages in `frontend/web-app/app/`
   - Shared hooks in `frontend/web-app/hooks`
   - API integration in `frontend/web-app/app/api`
