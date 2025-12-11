# Usage Guide - New Features

## 🎉 Overview

Project đã được refactor với các tính năng mới:
- ✅ NestJS Best Practices Folder Structure
- ✅ Input Validation
- ✅ Exception Handling
- ✅ Response Transformation
- ✅ Swagger/OpenAPI Documentation
- ✅ Repository Pattern
- ✅ CQRS Pattern
- ✅ Nested Objects
- ✅ RESTful API Best Practices

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Swagger Documentation
```
http://localhost:3000/api/docs
```

## 🔍 Organizations API

### 1. Get All Organizations
```http
GET /api/organizations?page=1&limit=25&q=search&orderBy=-createdAt
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 25, max: 100)
- `q` (optional): Search term (searches in name)
- `orderBy` (optional): Sort fields (prefix with `-` for DESC, e.g., `-createdAt,name`)
- `select` (optional): Comma-separated fields to return

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Acme Corporation",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "version": 1
      }
    ],
    "meta": {
      "page": 1,
      "limit": 25,
      "totalItems": 100,
      "totalPages": 4,
      "hasPrevious": false,
      "hasNext": true
    }
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### 2. Get Organization with Nested Objects (NEW! 🎉)
```http
GET /api/organizations/:name?include=members,comments
```

**Path Parameters:**
- `name`: Organization name

**Query Parameters:**
- `include` (optional): Comma-separated list of relations to include
  - `members`: Include organization members (users)
  - `comments`: Include organization comments
  - Omit to include all relations

**Example:**
```http
GET /api/organizations/acme-corp?include=members,comments
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Corporation",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "version": 1,
    "members": [
      {
        "id": "user-id-1",
        "organization": "123e4567-e89b-12d3-a456-426614174000",
        "loginId": "john.doe",
        "avatar": "https://example.com/avatar.jpg",
        "followers": 100,
        "following": 50,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "version": 1
      }
    ],
    "comments": [
      {
        "id": "comment-id-1",
        "organization": "123e4567-e89b-12d3-a456-426614174000",
        "comment": "Great organization!",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z",
        "version": 1
      }
    ]
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### 3. Get Organization Members
```http
GET /api/organizations/:name/members?page=1&limit=25&q=search
```

**Response:** Paginated list of users

### 4. Get Organization Comments
```http
GET /api/organizations/:name/comments?page=1&limit=25&q=search
```

**Response:** Paginated list of comments

### 5. Create Comment for Organization
```http
POST /api/organizations/:name/comments
Content-Type: application/json

{
  "comment": "This is a great organization!"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "comment-id",
    "organization": "org-id",
    "comment": "This is a great organization!",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "version": 1
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### 6. Delete All Comments for Organization
```http
DELETE /api/organizations/:name/comments
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "count": 5
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## 🏗️ Architecture Changes

### Folder Structure

#### API Gateway
```
api-gateway/src/
├── common/
│   ├── dto/              # Shared DTOs (Pagination, etc.)
│   ├── filters/          # Exception filters
│   ├── interceptors/     # Transform, Logging interceptors
│   └── pipes/            # Validation pipes
├── config/               # Configuration files
├── organizations/
│   ├── dto/              # Organization DTOs
│   └── organizations.controller.ts
└── main.ts
```

#### Microservices
```
microservices/organizations-svc/src/
├── organizations/
│   ├── commands/         # CQRS Commands
│   │   ├── create-organization.command.ts
│   │   └── handlers/
│   ├── queries/          # CQRS Queries
│   │   ├── get-organizations.query.ts
│   │   └── handlers/
│   ├── controllers/       # gRPC Controllers
│   ├── services/          # Business Logic
│   ├── repositories/     # Data Access Layer
│   ├── entities/          # Database Entities
│   └── dto/               # Data Transfer Objects
```

## 🔧 CQRS Pattern Usage

### Commands (Write Operations)
```typescript
// In service
await this.commandBus.execute(
  new CreateOrganizationCommand(organizationDto)
);
```

### Queries (Read Operations)
```typescript
// In service
const organizations = await this.queryBus.execute(
  new GetOrganizationsQuery(options)
);
```

## 📦 Dependencies

### New Dependencies Added:
- `@nestjs/cqrs`: CQRS pattern support
- `@nestjs/swagger`: API documentation
- `class-validator`: Input validation
- `class-transformer`: Object transformation

### Installation:
```bash
cd api-gateway
npm install

cd ../microservices/organizations-svc
npm install
```

## 🚀 Running the Project

```bash
# Install dependencies
npm run install

# Build
npm run build

# Start with Docker
npm run docker:start

# Or start individually
cd api-gateway && npm run start:dev
cd microservices/organizations-svc && npm run start:dev
```

## 📝 Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 404,
  "timestamp": "2023-01-01T00:00:00.000Z",
  "path": "/api/organizations/invalid",
  "message": ["Organization not found"],
  "error": "Not Found"
}
```

## 🔐 Validation

Input validation is automatic via `ValidationPipe`. Invalid requests return:

```json
{
  "statusCode": 400,
  "timestamp": "2023-01-01T00:00:00.000Z",
  "path": "/api/organizations",
  "message": [
    "name must be longer than or equal to 2 characters",
    "name should not be empty"
  ]
}
```

## 📊 Response Format

All successful responses follow this format:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## 🎯 Best Practices Implemented

1. **Separation of Concerns**: Repository → Service → Controller
2. **CQRS**: Commands for writes, Queries for reads
3. **Validation**: Automatic input validation
4. **Error Handling**: Consistent error responses
5. **Logging**: Request/response logging
6. **Documentation**: Swagger/OpenAPI
7. **Pagination**: Standardized pagination
8. **Nested Objects**: API Gateway aggregation pattern

## 🔄 Migration Notes

### Breaking Changes:
- URL changed from `/orgs` to `/organizations`
- Response format changed (now wrapped in `data` field)
- Error format changed (now includes `timestamp`, `path`)

### Backward Compatibility:
- Old endpoints still work but return new format
- Consider versioning API if needed

## 📚 References

- [NestJS Documentation](https://docs.nestjs.com/)
- [CQRS Pattern](https://docs.nestjs.com/recipes/cqrs)
- [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [RESTful API Best Practices](https://restfulapi.net/)

