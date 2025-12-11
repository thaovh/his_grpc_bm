# Service Implementation Guide

Hướng dẫn chi tiết để triển khai một microservice mới theo mô hình và best practices của project.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Code Templates](#code-templates)
5. [Integration Checklist](#integration-checklist)
6. [Testing](#testing)

## 🎯 Overview

Project sử dụng kiến trúc:
- **API Gateway** (REST) - Entry point cho clients
- **Microservices** (gRPC) - Business logic và data access
- **CQRS Pattern** - Tách biệt Commands và Queries
- **Repository Pattern** - Data access layer (TypeORM)
- **Nested Objects** - API Gateway aggregation
- **TypeORM** - ORM cho database operations
- **Oracle 12c** - Database (với giới hạn 32 ký tự cho tên field/column)

## ✅ Prerequisites

- Node.js v12+
- Docker & Docker Compose
- Oracle 12c database (hoặc Oracle XE container)
- Oracle Instant Client (cho oracledb package)
- Hiểu biết về NestJS, gRPC, Protocol Buffers, TypeORM
- Đã đọc và hiểu cấu trúc project hiện tại

## ⚠️ Oracle 12c Naming Constraints

**QUAN TRỌNG**: Oracle 12c có giới hạn nghiêm ngặt về tên:
- **Tên field/column**: Tối đa **32 ký tự**
- **Tên table**: Tối đa **30 ký tự** (128 ký tự từ Oracle 12c R2)
- **Tên index**: Tối đa **30 ký tự**
- **Tên constraint**: Tối đa **30 ký tự**

**Quy ước đặt tên Table:**
- **Format**: `{SERVICE_PREFIX}_{ENTITIES}` - UPPERCASE, có tiền tố service
- **Service Prefix**: 3-4 ký tự viết tắt của service name
- **Ví dụ**: 
  - Service `users` → Prefix `USR` → Table `USR_USERS` (9 chars - OK)
  - Service `products` → Prefix `PRD` → Table `PRD_PRODUCTS` (12 chars - OK)
  - Service `orders` → Prefix `ORD` → Table `ORD_ORDERS` (10 chars - OK)
  - Service `organizations` → Prefix `ORG` → Table `ORG_ORGANIZATIONS` (17 chars - OK)
  - Service `user-profiles` → Prefix `USRP` → Table `USRP_USER_PROFILES` (18 chars - OK)

**Service Prefix Mapping:**
- `users` → `USR` → Table: `USR_USERS`
- `products` → `PRD` → Table: `PRD_PRODUCTS`
- `orders` → `ORD` → Table: `ORD_ORDERS`
- `organizations` → `ORG` → Table: `ORG_ORGANIZATIONS`
- `user-profiles` → `USRP` → Table: `USRP_USER_PROFILES`
- `product-categories` → `PRDC` → Table: `PRDC_PRODUCT_CATEGORIES`
- `order-items` → `ORDI` → Table: `ORDI_ORDER_ITEMS`
- `comments` → `CMT` → Table: `CMT_COMMENTS`

**Cách tạo Service Prefix:**
1. Lấy 3-4 ký tự đầu của các từ trong service name
2. Nếu service name ngắn: dùng toàn bộ (e.g., `users` → `USR`)
3. Nếu service name dài: lấy chữ cái đầu của mỗi từ (e.g., `user-profiles` → `USRP`)
4. Luôn UPPERCASE
5. Đảm bảo prefix + table name <= 30 ký tự

**Best Practices:**
- Sử dụng UPPERCASE cho tên table và column (Oracle convention)
- Sử dụng service prefix (3-4 ký tự) + plural form cho table names
- Format: `{SERVICE_PREFIX}_{TABLE_NAME}` (e.g., `USR_USERS`, `PRD_PRODUCTS`)
- Service prefix giúp phân biệt tables từ các services khác nhau
- Sử dụng underscore `_` thay vì camelCase
- Rút gọn tên nếu cần: `createdAt` → `CREATED_AT` (10 chars)
- Tránh tên quá dài: `userAuthenticationToken` → `USR_AUTH_TOKEN` (14 chars)
- Luôn specify `name` property trong decorators để đảm bảo tên chính xác
- Nếu table name > 30 chars, cần rút gọn prefix hoặc table name
- Ví dụ: `USR_USER_AUTHENTICATION_TOKENS` (28 chars) → `USR_USR_AUTH_TKNS` (16 chars)

## 🚀 Step-by-Step Implementation

### Step 1: Tạo Proto File Definition

**Location:** `_proto/{service-name}.proto`

```protobuf
syntax = "proto3";

package {service-name};

import "commons.proto";

message {EntityName} {
  string id = 1;
  string name = 2;
  string createdAt = 3;
  string updatedAt = 4;
  int32 version = 5;
  // Add more fields as needed
}

message Create{EntityName}Input {
  string name = 1;
  // Add more fields as needed
}

message Update{EntityName}Input {
  string id = 1;
  string name = 2;
  // Add more fields as needed
}

message {EntityName}List {
  repeated {EntityName} data = 1;
}

service {EntityName}Service {
  rpc findAll (commons.Query) returns ({EntityName}List) {}
  rpc findById (commons.Id) returns ({EntityName}) {}
  rpc count (commons.Query) returns (commons.Count) {}
  rpc create (Create{EntityName}Input) returns ({EntityName}) {}
  rpc update (Update{EntityName}Input) returns ({EntityName}) {}
  rpc destroy (commons.Query) returns (commons.Count) {}
}
```

**Example:** `_proto/products.proto`

### Step 2: Tạo Microservice Structure

**Location:** `microservices/{service-name}-svc/`

#### 2.1. Tạo Folder Structure

```bash
cd microservices
mkdir -p {service-name}-svc/src/{service-name}/{commands,queries,controllers,services,repositories,entities,dto}
```

**Structure:**
```
{service-name}-svc/
├── src/
│   ├── _proto/
│   │   ├── {service-name}.proto
│   │   └── commons.proto
│   ├── {service-name}/
│   │   ├── commands/
│   │   │   ├── create-{entity}.command.ts
│   │   │   ├── update-{entity}.command.ts
│   │   │   ├── delete-{entity}.command.ts
│   │   │   └── handlers/
│   │   ├── queries/
│   │   │   ├── get-{entity}.query.ts
│   │   │   ├── get-{entity}s.query.ts
│   │   │   ├── count-{entity}s.query.ts
│   │   │   └── handlers/
│   │   ├── controllers/
│   │   │   └── {service-name}.controller.ts
│   │   ├── services/
│   │   │   └── {service-name}.service.ts
│   │   ├── repositories/
│   │   │   └── {service-name}.repository.ts
│   │   ├── entities/
│   │   │   └── {entity}.entity.ts
│   │   ├── dto/
│   │   │   ├── create-{entity}.dto.ts
│   │   │   └── update-{entity}.dto.ts
│   │   ├── {service-name}.interface.ts
│   │   ├── {service-name}.module.ts
│   │   └── {service-name}.seeder.ts
│   ├── commons/
│   │   ├── entities/
│   │   │   └── base.entity.ts
│   │   ├── subscribers/
│   │   │   └── audit.subscriber.ts
│   │   ├── interceptors/
│   │   │   └── user-context.interceptor.ts
│   │   └── interfaces/
│   │       └── commons.interface.ts
│   ├── database/
│   │   └── database.module.ts
│   ├── app.module.ts
│   └── main.ts
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

#### 2.2. Copy Proto Files

```bash
cp _proto/{service-name}.proto microservices/{service-name}-svc/src/_proto/
cp _proto/commons.proto microservices/{service-name}-svc/src/_proto/
```

### Step 3: Create Base Entity (Optional but Recommended)

**File:** `microservices/{service-name}-svc/src/commons/entities/base.entity.ts`

```typescript
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

/**
 * Base Entity với các fields chung cho tất cả entities
 * Tuân thủ Oracle 12c naming constraints (<= 32 chars cho column names)
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ 
    type: 'timestamp', 
    name: 'CREATED_AT', // 10 chars - OK
    default: () => 'SYSTIMESTAMP' // Oracle syntax
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    name: 'UPDATED_AT', // 10 chars - OK
    default: () => 'SYSTIMESTAMP',
    onUpdate: 'SYSTIMESTAMP' 
  })
  updatedAt: Date;

  @DeleteDateColumn({ 
    type: 'timestamp', 
    name: 'DELETED_AT', // 10 chars - OK
    nullable: true 
  })
  deletedAt: Date | null;

  @VersionColumn({ 
    name: 'VERSION', // 7 chars - OK
    default: 1 
  })
  version: number;

  @Column({ 
    type: 'varchar2', 
    length: 36, // UUID length
    name: 'CREATED_BY', // 10 chars - OK
    nullable: true,
    comment: 'User ID who created the record' 
  })
  createdBy: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 36, // UUID length
    name: 'UPDATED_BY', // 10 chars - OK
    nullable: true,
    comment: 'User ID who last updated the record' 
  })
  updatedBy: string | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_ACTIVE', // 9 chars - OK
    default: 1,
    comment: 'Active flag: 1 = active, 0 = inactive' 
  })
  isActive: number; // Oracle: use number(1,0) for boolean
}
```

**Lợi ích của Base Entity:**
- ✅ Tái sử dụng code cho các fields chung
- ✅ Đảm bảo consistency về naming và types
- ✅ Dễ maintain và update
- ✅ Tuân thủ Oracle 12c constraints
- ✅ Hỗ trợ soft delete với `deletedAt`
- ✅ Audit trail với `createdBy`/`updatedBy`
- ✅ Active flag với `isActive`

**Base Entity Fields Summary:**
| Field | Type | Column Name | Length | Purpose |
|-------|------|-------------|--------|---------|
| `id` | string (UUID) | `ID` | 2 | Primary key |
| `createdAt` | Date | `CREATED_AT` | 10 | Thời điểm tạo |
| `updatedAt` | Date | `UPDATED_AT` | 10 | Thời điểm cập nhật |
| `deletedAt` | Date \| null | `DELETED_AT` | 10 | Soft delete timestamp |
| `version` | number | `VERSION` | 7 | Optimistic locking |
| `createdBy` | string \| null | `CREATED_BY` | 10 | User ID tạo record |
| `updatedBy` | string \| null | `UPDATED_BY` | 10 | User ID cập nhật cuối |
| `isActive` | number | `IS_ACTIVE` | 9 | Active flag (1/0) |

### Step 3.1: Create Entity Subscriber (Auto-assign createdBy/updatedBy)

**File:** `microservices/{service-name}-svc/src/commons/subscribers/audit.subscriber.ts`

```typescript
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { userContextStorage } from '../interceptors/user-context.interceptor';

/**
 * Entity Subscriber để tự động gán createdBy/updatedBy
 * Lấy user ID từ AsyncLocalStorage context
 */
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
  /**
   * Lấy current user ID từ AsyncLocalStorage context
   * Context được set bởi UserContextInterceptor
   */
  private getCurrentUserId(): string | null {
    const store = userContextStorage.getStore();
    return store?.userId || null;
  }

  /**
   * Before insert: Set createdBy và updatedBy
   */
  beforeInsert(event: InsertEvent<BaseEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.createdBy = userId;
      event.entity.updatedBy = userId; // Also set on create
    }
  }

  /**
   * Before update: Set updatedBy
   */
  beforeUpdate(event: UpdateEvent<BaseEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }
}
```

**File:** `microservices/{service-name}-svc/src/commons/interceptors/user-context.interceptor.ts`

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * AsyncLocalStorage để lưu user context
 * Sử dụng để truyền user ID qua các async operations
 */
export const userContextStorage = new AsyncLocalStorage<{ userId: string }>();

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Extract user ID from JWT token or request headers
    // Option 1: From JWT token (if using Passport/JWT)
    const userId = request.user?.id || 
                   request.user?.userId ||
                   // Option 2: From custom header
                   request.headers['x-user-id'] || 
                   // Option 3: From query parameter (for testing)
                   request.query?.userId ||
                   null;
    
    if (userId) {
      // Store user ID in AsyncLocalStorage for use in subscribers
      return userContextStorage.run({ userId }, () => next.handle());
    }
    
    return next.handle();
  }
}
```

**Register Subscriber trong Database Module:**

**File:** `microservices/{service-name}-svc/src/database/database.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {EntityName} } from '../{service-name}/entities/{entity}.entity';
import { AuditSubscriber } from '../commons/subscribers/audit.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1521', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      sid: process.env.DB_SID,
      serviceName: process.env.DB_SERVICE_NAME,
      entities: [{EntityName}],
      subscribers: [AuditSubscriber], // Register audit subscriber
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 3000,
      extra: {
        connectString: process.env.DB_CONNECT_STRING,
      },
    }),
  ],
})
export class DatabaseModule {}
```

**Register Interceptor trong App Module:**

**File:** `microservices/{service-name}-svc/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { {EntityName}Module } from './{service-name}/{service-name}.module';
import { UserContextInterceptor } from './commons/interceptors/user-context.interceptor';

@Module({
  imports: [
    DatabaseModule,
    {EntityName}Module,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserContextInterceptor, // Register interceptor for user context
    },
  ],
})
export class AppModule {}
```

**Cách hoạt động:**
1. `UserContextInterceptor` extract user ID từ request (JWT token, header, etc.)
2. Lưu user ID vào `AsyncLocalStorage`
3. `AuditSubscriber` lấy user ID từ `AsyncLocalStorage` khi insert/update
4. Tự động gán `createdBy` khi insert, `updatedBy` khi update

**Lưu ý:**
- Nếu không có user ID trong request, `createdBy`/`updatedBy` sẽ là `null`
- Có thể set `SYSTEM_USER_ID` trong environment variable làm fallback
- Đảm bảo JWT authentication middleware chạy trước interceptor

### Step 4: Implement Entity

**File:** `microservices/{service-name}-svc/src/{service-name}/entities/{entity}.entity.ts`

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

/**
 * IMPORTANT: Oracle 12c naming constraints
 * - Table names must be <= 30 characters (Oracle 12c) or 128 (12c R2+)
 * - Field/Column names must be <= 32 characters
 * - Use UPPERCASE for table/column names (Oracle convention)
 * - Use service prefix + plural form for table names
 * - Use abbreviations if needed to stay within limit
 * 
 * Naming Pattern:
 * - Service: users (kebab-case)
 * - Service Prefix: USR (3-4 chars abbreviation)
 * - Entity: User (PascalCase)
 * - Table: USR_USERS (SERVICE_PREFIX + UPPERCASE plural)
 * 
 * Examples:
 * - users service → USR_USERS
 * - products service → PRD_PRODUCTS
 * - orders service → ORD_ORDERS
 */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

@Entity('{SERVICE_PREFIX}_{ENTITIES}') // Table: SERVICE_PREFIX + UPPERCASE plural (e.g., USR_USERS, PRD_PRODUCTS)
export class {EntityName} extends BaseEntity {
  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'NAME', // Explicit uppercase name, <= 32 chars
    comment: 'The name of the {entity}' 
  })
  name: string;

  // Add more columns as needed
  // Remember: All column names must be <= 32 characters
  // Base fields (id, createdAt, updatedAt, deletedAt, version, createdBy, updatedBy, isActive) 
  // are inherited from BaseEntity
}
```

**Alternative: Nếu không dùng Base Entity:**
```typescript
@Entity('{SERVICE_PREFIX}_{ENTITIES}')
export class {EntityName} {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar2', length: 255, name: 'NAME' })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'CREATED_AT', default: () => 'SYSTIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'UPDATED_AT', default: () => 'SYSTIMESTAMP', onUpdate: 'SYSTIMESTAMP' })
  updatedAt: Date;

  @VersionColumn({ name: 'VERSION', default: 1 })
  version: number;
}
```

### Step 5: Implement DTOs

**File:** `microservices/{service-name}-svc/src/{service-name}/dto/create-{entity}.dto.ts`

```typescript
export class Create{EntityName}Dto {
  readonly id?: string;
  readonly name: string;
  // Add more fields as needed
}
```

**File:** `microservices/{service-name}-svc/src/{service-name}/dto/update-{entity}.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { Create{EntityName}Dto } from './create-{entity}.dto';

export class Update{EntityName}Dto extends PartialType(Create{EntityName}Dto) {}
```

### Step 6: Implement Repository

**File:** `microservices/{service-name}-svc/src/{service-name}/repositories/{service-name}.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { {EntityName} } from '../entities/{entity}.entity';
import { Create{EntityName}Dto } from '../dto/create-{entity}.dto';

@Injectable()
export class {EntityName}Repository {
  constructor(
    @InjectRepository({EntityName})
    private readonly {entity}Repository: Repository<{EntityName}>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext({EntityName}Repository.name);
  }

  async findAll(options?: FindManyOptions<{EntityName}>): Promise<{EntityName}[]> {
    this.logger.info('{EntityName}Repository#findAll.call', options);
    const result = await this.{entity}Repository.find(options);
    this.logger.info('{EntityName}Repository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<{EntityName}>): Promise<{EntityName} | null> {
    this.logger.info('{EntityName}Repository#findOne.call', options);
    const result = await this.{entity}Repository.findOne(options);
    this.logger.info('{EntityName}Repository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<{EntityName} | null> {
    this.logger.info('{EntityName}Repository#findById.call', { id });
    const result = await this.{entity}Repository.findOne({ where: { id } });
    this.logger.info('{EntityName}Repository#findById.result', { found: !!result });
    return result;
  }

  async count(options?: FindManyOptions<{EntityName}>): Promise<number> {
    this.logger.info('{EntityName}Repository#count.call', options);
    const result = await this.{entity}Repository.count(options);
    this.logger.info('{EntityName}Repository#count.result', { count: result });
    return result;
  }

  async create(data: Create{EntityName}Dto): Promise<{EntityName}> {
    this.logger.info('{EntityName}Repository#create.call', data);
    const {entity} = this.{entity}Repository.create(data);
    const result = await this.{entity}Repository.save({entity});
    this.logger.info('{EntityName}Repository#create.result', { id: result.id });
    return result;
  }

  async update(id: string, data: Partial<Create{EntityName}Dto>): Promise<{EntityName}> {
    this.logger.info('{EntityName}Repository#update.call', { id, data });
    await this.{entity}Repository.update(id, data);
    const result = await this.findById(id);
    this.logger.info('{EntityName}Repository#update.result', { id: result?.id });
    if (!result) {
      throw new Error('{EntityName} not found after update');
    }
    return result;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('{EntityName}Repository#delete.call', { id });
    await this.{entity}Repository.delete(id);
    this.logger.info('{EntityName}Repository#delete.result', { deleted: true });
  }
}
```

### Step 7: Implement CQRS Commands

**File:** `microservices/{service-name}-svc/src/{service-name}/commands/create-{entity}.command.ts`

```typescript
import { ICommand } from '@nestjs/cqrs';
import { Create{EntityName}Dto } from '../dto/create-{entity}.dto';

export class Create{EntityName}Command implements ICommand {
  constructor(public readonly {entity}Dto: Create{EntityName}Dto) {}
}
```

**File:** `microservices/{service-name}-svc/src/{service-name}/commands/handlers/create-{entity}.handler.ts`

```typescript
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { Create{EntityName}Command } from '../create-{entity}.command';
import { {EntityName}Repository } from '../../repositories/{service-name}.repository';
import { {EntityName} } from '../../entities/{entity}.entity';

@CommandHandler(Create{EntityName}Command)
export class Create{EntityName}Handler implements ICommandHandler<Create{EntityName}Command> {
  constructor(
    private readonly repository: {EntityName}Repository,
    private readonly eventBus: EventBus,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(Create{EntityName}Handler.name);
  }

  async execute(command: Create{EntityName}Command): Promise<{EntityName}> {
    this.logger.info('Create{EntityName}Handler#execute.call', command.{entity}Dto);
    const {entity} = await this.repository.create(command.{entity}Dto);
    this.logger.info('Create{EntityName}Handler#execute.result', { id: {entity}.id });
    // TODO: Publish event if needed
    // this.eventBus.publish(new {EntityName}CreatedEvent({entity}));
    return {entity};
  }
}
```

### Step 8: Implement CQRS Queries

**File:** `microservices/{service-name}-svc/src/{service-name}/queries/get-{entity}s.query.ts`

```typescript
import { IQuery } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { {EntityName} } from '../entities/{entity}.entity';

export class Get{EntityName}sQuery implements IQuery {
  constructor(public readonly options?: FindManyOptions<{EntityName}>) {}
}
```

**File:** `microservices/{service-name}-svc/src/{service-name}/queries/handlers/get-{entity}s.handler.ts`

```typescript
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { Get{EntityName}sQuery } from '../get-{entity}s.query';
import { {EntityName}Repository } from '../../repositories/{service-name}.repository';
import { {EntityName} } from '../../entities/{entity}.entity';

@QueryHandler(Get{EntityName}sQuery)
export class Get{EntityName}sHandler implements IQueryHandler<Get{EntityName}sQuery> {
  constructor(
    private readonly repository: {EntityName}Repository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(Get{EntityName}sHandler.name);
  }

  async execute(query: Get{EntityName}sQuery): Promise<{EntityName}[]> {
    this.logger.info('Get{EntityName}sHandler#execute.call', query.options);
    return this.repository.findAll(query.options);
  }
}
```

**Repeat for:**
- `get-{entity}.query.ts` + handler
- `count-{entity}s.query.ts` + handler

### Step 9: Implement Service

**File:** `microservices/{service-name}-svc/src/{service-name}/services/{service-name}.service.ts`

```typescript
import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions, FindOneOptions } from 'typeorm';

import { {EntityName}Service } from '../{service-name}.interface';
import { {EntityName} } from '../entities/{entity}.entity';
import { Create{EntityName}Dto } from '../dto/create-{entity}.dto';

import { Create{EntityName}Command } from '../commands/create-{entity}.command';
import { Get{EntityName}sQuery } from '../queries/get-{entity}s.query';
import { Count{EntityName}sQuery } from '../queries/count-{entity}s.query';

@Injectable()
export class {EntityName}ServiceImpl implements {EntityName}Service {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext({EntityName}ServiceImpl.name);
  }

  async findAll(query?: FindManyOptions<{EntityName}>): Promise<Array<{EntityName}>> {
    this.logger.info('{EntityName}Service#findAll.call', query);
    return this.queryBus.execute(new Get{EntityName}sQuery(query));
  }

  async findOne(query?: FindOneOptions<{EntityName}>): Promise<{EntityName} | null> {
    this.logger.info('{EntityName}Service#findOne.call', query);
    const result = await this.queryBus.execute(new Get{EntityName}sQuery(query as FindManyOptions<{EntityName}>));
    return result[0] || null;
  }

  async count(query?: FindManyOptions<{EntityName}>): Promise<number> {
    this.logger.info('{EntityName}Service#count.call', query);
    return this.queryBus.execute(new Count{EntityName}sQuery(query));
  }

  async create({entity}Dto: Create{EntityName}Dto): Promise<{EntityName}> {
    this.logger.info('{EntityName}Service#create.call', {entity}Dto);
    return this.commandBus.execute(new Create{EntityName}Command({entity}Dto));
  }
}
```

### Step 10: Implement Interface

**File:** `microservices/{service-name}-svc/src/{service-name}/{service-name}.interface.ts`

```typescript
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { {EntityName} } from './entities/{entity}.entity';
import { Create{EntityName}Dto } from './dto/create-{entity}.dto';

export interface {EntityName}QueryResult {
  data: Array<{EntityName}>;
}

export interface {EntityName}Service {
  findAll(query?: FindManyOptions<{EntityName}>): Promise<Array<{EntityName}>>;
  findOne(query?: FindOneOptions<{EntityName}>): Promise<{EntityName} | null>;
  count(query?: FindManyOptions<{EntityName}>): Promise<number>;
  create({entity}: Create{EntityName}Dto): Promise<{EntityName}>;
}
```

### Step 11: Implement gRPC Controller

**File:** `microservices/{service-name}-svc/src/{service-name}/controllers/{service-name}.controller.ts`

```typescript
import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { {EntityName}Service, {EntityName}QueryResult } from '../{service-name}.interface';
import { {EntityName} } from '../entities/{entity}.entity';

@Controller()
export class {EntityName}Controller {
  constructor(
    @Inject('{EntityName}Service') private readonly {entity}Service: {EntityName}Service,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext({EntityName}Controller.name);
  }

  @GrpcMethod('{EntityName}Service', 'findAll')
  async findAll(query: Query): Promise<{EntityName}QueryResult> {
    this.logger.info('{EntityName}Controller#findAll.call', query);

    const result: Array<{EntityName}> = await this.{entity}Service.findAll({
      select: !isEmpty(query.attributes) ? query.attributes.split(',') : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    this.logger.info('{EntityName}Controller#findAll.result', result);

    return { data: result };
  }

  @GrpcMethod('{EntityName}Service', 'findById')
  async findById(data: Id): Promise<{EntityName}> {
    this.logger.info('{EntityName}Controller#findById.call', data);

    const result: {EntityName} | null = await this.{entity}Service.findOne({
      where: { id: data.id },
    });

    if (!result) {
      throw new Error('{EntityName} not found');
    }

    this.logger.info('{EntityName}Controller#findById.result', result);

    return result;
  }

  @GrpcMethod('{EntityName}Service', 'count')
  async count(query: Query): Promise<Count> {
    this.logger.info('{EntityName}Controller#count.call', query);

    const count: number = await this.{entity}Service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('{EntityName}Controller#count.result', count);

    return { count };
  }

  @GrpcMethod('{EntityName}Service', 'create')
  async create(data: Create{EntityName}Input): Promise<{EntityName}> {
    this.logger.info('{EntityName}Controller#create.call', data);

    const result: {EntityName} = await this.{entity}Service.create(data);

    this.logger.info('{EntityName}Controller#create.result', result);

    return result;
  }
}
```

### Step 12: Implement Module

**File:** `microservices/{service-name}-svc/src/{service-name}/{service-name}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';

import { {EntityName} } from './entities/{entity}.entity';
import { {EntityName}Controller } from './controllers/{service-name}.controller';
import { {EntityName}ServiceImpl } from './services/{service-name}.service';
import { {EntityName}Repository } from './repositories/{service-name}.repository';
import { {EntityName}Seeder } from './{service-name}.seeder';

// Commands
import { Create{EntityName}Handler } from './commands/handlers/create-{entity}.handler';

// Queries
import { Get{EntityName}sHandler } from './queries/handlers/get-{entity}s.handler';
import { Count{EntityName}sHandler } from './queries/handlers/count-{entity}s.handler';

const CommandHandlers = [Create{EntityName}Handler];
const QueryHandlers = [Get{EntityName}sHandler, Count{EntityName}sHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([{EntityName}]),
    CqrsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        prettyPrint: process.env.NODE_ENV === 'development',
      },
    }),
  ],
  controllers: [{EntityName}Controller],
  providers: [
    {EntityName}Seeder,
    {EntityName}Repository,
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: '{EntityName}Service',
      useClass: {EntityName}ServiceImpl,
    },
  ],
  exports: ['{EntityName}Service'],
})
export class {EntityName}Module {}
```

### Step 13: Update Database Module

**File:** `microservices/{service-name}-svc/src/database/database.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { {EntityName} } from '../{service-name}/entities/{entity}.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1521', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, // Service name or SID
      sid: process.env.DB_SID, // Oracle SID (if using SID instead of service name)
      serviceName: process.env.DB_SERVICE_NAME, // Oracle service name (alternative to SID)
      entities: [{EntityName}],
      synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 3,
      retryDelay: 3000,
      extra: {
        // Oracle-specific options
        connectString: process.env.DB_CONNECT_STRING, // Full connection string (optional)
        // Example: 'localhost:1521/XEPDB1'
      },
    }),
  ],
})
export class DatabaseModule {}
```

**Oracle 12c Configuration Notes:**
1. **Connection**: Use either `sid` or `serviceName`, not both
2. **Port**: Default Oracle port is 1521
3. **Naming**: Oracle converts unquoted identifiers to UPPERCASE
4. **Field Length**: Column/field names must be <= 32 characters
5. **Production**: Always use migrations, never `synchronize: true` in production

**Production Configuration:**
```typescript
synchronize: false,
migrations: ['dist/migrations/*.js'],
migrationsRun: true,
```

### Step 14: Update Main File

**File:** `microservices/{service-name}-svc/src/main.ts`

```typescript
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { {EntityName}Seeder } from './{service-name}/{service-name}.seeder';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.URL}:${process.env.PORT}`,
      package: '{service-name}',
      protoPath: join(__dirname, './_proto/{service-name}.proto'),
      loader: {
        enums: String,
        objects: true,
        arrays: true,
      },
    },
  });

  app.useLogger(app.get(Logger));

  const seeder: {EntityName}Seeder = app.get({EntityName}Seeder);

  await seeder.seedDatabase();

  return app.listenAsync();
}

bootstrap();
```

### Step 15: Create Seeder (Optional)

**File:** `microservices/{service-name}-svc/src/{service-name}/{service-name}.seeder.ts`

```typescript
import { PinoLogger } from 'nestjs-pino';
import { Inject, Injectable } from '@nestjs/common';
import { {EntityName}Service } from './{service-name}.interface';

@Injectable()
export class {EntityName}Seeder {
  constructor(
    @Inject('{EntityName}Service') private readonly service: {EntityName}Service,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext({EntityName}Seeder.name);
  }

  async seedDatabase(): Promise<number> {
    const recordCount: number = await this.service.count();

    if (recordCount > 0) {
      this.logger.info('{EntityName}Seeder#seedDatabase', 'Aborting...');
      return recordCount;
    }

    // TODO: Add seed data
    // const {entity} = await this.service.create({ name: 'Example' });

    return 0;
  }
}
```

### Step 16: Update Package.json

**File:** `microservices/{service-name}-svc/package.json`

Dependencies cần thiết:
```json
{
  "dependencies": {
    "@nestjs/common": "^9.0.0",
    "@nestjs/core": "^9.0.0",
    "@nestjs/microservices": "^9.0.0",
    "@nestjs/typeorm": "^9.0.0",
    "@nestjs/cqrs": "^9.0.0",
    "typeorm": "^0.3.0",
    "oracledb": "^5.5.0",
    "nestjs-pino": "^2.4.0",
    "rxjs": "^7.0.0"
  }
}
```

**Note:** 
- `oracledb` package is required for Oracle database connection
- Oracle Instant Client must be installed on the system
- Update:
  - `name`: `{service-name}-svc`
  - `description`: Update description

### Step 17: Update Docker Compose

**File:** `docker-compose.yaml`

Add new service:

```yaml
{service-name}-svc:
  image: "{service-name}-svc:dev"
  build:
    context: "./microservices/{service-name}-svc"
  networks:
    - "frontend"
    - "backend"
    - "{service-name}domain"
  expose:
    - "50051"
  depends_on:
    - "{service-name}-db"
  environment:
    NODE_ENV: "test"
    URL: "0.0.0.0"
    PORT: "50051"
    DB_HOST: "{service-name}-db"
    DB_PORT: "1521"
    DB_USER: "{service_name_user}" # Oracle username (max 30 chars)
    DB_PASSWORD: "{service_name_pass}"
    DB_NAME: "XEPDB1" # Service name or database name
    DB_SID: "XE" # Oracle SID (if using SID)
    DB_SERVICE_NAME: "XEPDB1" # Service name (alternative to SID)
    # OR use full connection string:
    # DB_CONNECT_STRING: "{service-name}-db:1521/XEPDB1"
  restart: "on-failure"

{service-name}-db:
  image: "container-registry.oracle.com/database/express:12.2.0.1-slim"
  networks:
    - "{service-name}domain"
  expose:
    - "1521"
    - "5500" # Oracle Enterprise Manager Express
  environment:
    ORACLE_PWD: "{oracle_password}"
    ORACLE_CHARACTERSET: "AL32UTF8"
    ORACLE_NLS_CHARACTERSET: "AL32UTF8"
  healthcheck:
    test: ["CMD-SHELL", "sqlplus -s system/${ORACLE_PWD}@localhost:1521/XE <<< 'SELECT 1 FROM DUAL;' | grep -q '1'"]
    interval: 30s
    timeout: 30s
    retries: 5
    start_period: 60s # Oracle takes time to start
  restart: "on-failure"
  volumes:
    - "{service-name}-db-data:/opt/oracle/oradata"
```

Add network and volume:
```yaml
networks:
  # ... existing networks
  {service-name}domain:

volumes:
  {service-name}-db-data:
```

**Oracle 12c Docker Notes:**
1. **Image**: Use Oracle's official container registry image
2. **Authentication**: Requires Oracle Container Registry login (free account)
3. **Alternative**: Use `gvenzl/oracle-xe:12.2.0.1-slim` (community image)
4. **Startup Time**: Oracle takes 1-2 minutes to fully start
5. **Memory**: Oracle XE requires at least 1GB RAM
6. **Character Set**: Use AL32UTF8 for international support

### Step 18: Integrate into API Gateway

#### 17.1. Copy Proto Files

```bash
cp _proto/{service-name}.proto api-gateway/src/_proto/
```

#### 17.2. Create Service Client Options

**File:** `api-gateway/src/{service-name}/{service-name}-svc.options.ts`

```typescript
import { join } from 'path';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const {EntityName}ServiceClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `${process.env.{ENTITY_NAME}_SVC_URL}:${process.env.{ENTITY_NAME}_SVC_PORT}`,
    package: '{service-name}',
    protoPath: join(__dirname, '../_proto/{service-name}.proto'),
    loader: {
      enums: String,
      objects: true,
      arrays: true,
    },
  },
};
```

#### 17.3. Create Interface

**File:** `api-gateway/src/{service-name}/{service-name}.interface.ts`

```typescript
import { Observable } from 'rxjs';
import { Count, Query, Id } from '../commons/interfaces/commons.interface';

export interface {EntityName} {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface {EntityName}QueryResult {
  data: Array<{EntityName}>;
}

export interface {EntityName}Service {
  findAll(query?: Query): Observable<{EntityName}QueryResult>;
  findById(id: Id): Observable<{EntityName}>;
  count(query?: Query): Observable<Count>;
  create(data: Create{EntityName}Input): Observable<{EntityName}>;
}
```

#### 17.4. Create DTOs

**File:** `api-gateway/src/{service-name}/dto/create-{entity}.dto.ts`

```typescript
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create{EntityName}Dto {
  @ApiProperty({
    example: 'Example Name',
    description: '{EntityName} name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  readonly name: string;
}
```

**File:** `api-gateway/src/{service-name}/dto/{entity}-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class {EntityName}ResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Example Name' })
  name: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 1 })
  version: number;
}
```

#### 17.5. Create Controller

**File:** `api-gateway/src/{service-name}/{service-name}.controller.ts`

```typescript
import { PinoLogger } from 'nestjs-pino';
import { ClientGrpc, Client } from '@nestjs/microservices';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  Inject,
  OnModuleInit,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { isEmpty } from 'lodash';

import { QueryUtils } from '../utils/query.utils';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../common/dto/pagination-response.dto';

import { {EntityName}Service, {EntityName}, {EntityName}QueryResult } from './{service-name}.interface';
import { {EntityName}ResponseDto } from './dto/{entity}-response.dto';
import { Create{EntityName}Dto } from './dto/create-{entity}.dto';

import { {EntityName}ServiceClientOptions } from './{service-name}-svc.options';

@ApiTags('{service-name}')
@Controller('{service-name}')
export class {EntityName}Controller implements OnModuleInit {
  constructor(
    @Inject('QueryUtils') private readonly queryUtils: QueryUtils,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext({EntityName}Controller.name);
  }

  @Client({EntityName}ServiceClientOptions)
  private readonly {entity}ServiceClient: ClientGrpc;

  private {entity}Service: {EntityName}Service;

  onModuleInit() {
    this.{entity}Service = this.{entity}ServiceClient.getService<{EntityName}Service>('{EntityName}Service');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all {entities}' })
  @ApiResponse({ status: 200, description: 'List of {entities}', type: PaginatedResponseDto })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<{EntityName}ResponseDto>> {
    this.logger.info('{EntityName}Controller#findAll.call', query);

    const args = {
      ...(await this.queryUtils.getQueryParams(query as any)),
    };

    const { count } = await this.{entity}Service
      .count({
        where: !isEmpty(query.q) ? JSON.stringify({ name: { $like: `%${query.q}%` } }) : undefined,
      })
      .toPromise();

    const data: {EntityName}QueryResult = await this.{entity}Service
      .findAll({
        attributes: args.attributes,
        where: !isEmpty(query.q) ? JSON.stringify({ name: { $like: `%${query.q}%` } }) : undefined,
        order: JSON.stringify(args.order),
        offset: args.offset,
        limit: args.limit,
      })
      .toPromise();

    const meta: PaginationMetaDto = {
      page: args.page,
      limit: args.limit,
      totalItems: count,
      totalPages: Math.ceil(count / args.limit),
      hasPrevious: args.page > 1,
      hasNext: args.page < Math.ceil(count / args.limit),
    };

    return {
      data: data.data as any,
      meta,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get {entity} by ID' })
  @ApiParam({ name: 'id', description: '{EntityName} ID' })
  @ApiResponse({ status: 200, description: '{EntityName} details', type: {EntityName}ResponseDto })
  @ApiResponse({ status: 404, description: '{EntityName} not found' })
  async findOne(@Param('id') id: string): Promise<{EntityName}ResponseDto> {
    this.logger.info('{EntityName}Controller#findOne.call', { id });

    const {entity}: {EntityName} = await this.{entity}Service.findById({ id }).toPromise();

    if (!{entity}) {
      throw new NotFoundException('{EntityName} not found');
    }

    return {entity} as any;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new {entity}' })
  @ApiResponse({ status: 201, description: '{EntityName} created successfully' })
  async create(@Body() dto: Create{EntityName}Dto): Promise<{EntityName}ResponseDto> {
    this.logger.info('{EntityName}Controller#create.call', dto);

    const result: {EntityName} = await this.{entity}Service.create(dto).toPromise();

    return result as any;
  }
}
```

#### 17.6. Create Module

**File:** `api-gateway/src/{service-name}/{service-name}.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { UtilsModule } from '../utils/utils.module';
import { {EntityName}Controller } from './{service-name}.controller';

@Module({
  imports: [
    UtilsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        prettyPrint: process.env.NODE_ENV === 'development',
      },
    }),
  ],
  controllers: [{EntityName}Controller],
})
export class {EntityName}Module {}
```

#### 17.7. Update App Module

**File:** `api-gateway/src/app.module.ts`

```typescript
import { {EntityName}Module } from './{service-name}/{service-name}.module';

@Module({
  imports: [
    // ... existing imports
    {EntityName}Module,
  ],
})
export class AppModule {}
```

#### 17.8. Update Config

**File:** `api-gateway/src/config/grpc.config.ts`

```typescript
{service-name}: {
  url: process.env.{ENTITY_NAME}_SVC_URL || '{service-name}-svc',
  port: process.env.{ENTITY_NAME}_SVC_PORT || '50051',
},
```

#### 17.9. Update Docker Compose for API Gateway

```yaml
api-gateway:
  environment:
    # ... existing env vars
    {ENTITY_NAME}_SVC_URL: "{service-name}-svc"
    {ENTITY_NAME}_SVC_PORT: "50051"
  depends_on:
    # ... existing dependencies
    - "{service-name}-svc"
```

## ✅ Integration Checklist

- [ ] Proto file created in `_proto/`
- [ ] Microservice folder structure created
- [ ] Base Entity created (optional but recommended)
- [ ] Audit Subscriber created (for auto-assign createdBy/updatedBy)
- [ ] User Context Interceptor created (for extracting user ID from request)
- [ ] Entity implemented (extends BaseEntity if using base entity)
- [ ] DTOs created (Create, Update, Response)
- [ ] Repository implemented
- [ ] CQRS Commands created
- [ ] CQRS Queries created
- [ ] Service implemented
- [ ] gRPC Controller implemented
- [ ] Module configured
- [ ] Database provider updated
- [ ] Main file updated
- [ ] Seeder created (if needed)
- [ ] Package.json configured
- [ ] Docker Compose updated
- [ ] API Gateway proto files copied
- [ ] API Gateway service client options created
- [ ] API Gateway interface created
- [ ] API Gateway DTOs created
- [ ] API Gateway controller created
- [ ] API Gateway module created
- [ ] App module updated
- [ ] Config updated
- [ ] Environment variables added
- [ ] Swagger documentation added

## 🧪 Testing

### 1. Test Microservice

```bash
cd microservices/{service-name}-svc
npm install
npm run build
npm run start:dev
```

### 2. Test API Gateway

```bash
cd api-gateway
npm install
npm run build
npm run start:dev
```

### 3. Test with Docker

```bash
docker-compose up --build
```

### 4. Test Endpoints

```bash
# Get all
curl http://localhost:3000/api/{service-name}

# Get by ID
curl http://localhost:3000/api/{service-name}/{id}

# Create
curl -X POST http://localhost:3000/api/{service-name} \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
```

## 📝 Naming Conventions

- **Service Name**: `{service-name}` (kebab-case, e.g., `products`, `orders`, `users`)
- **Service Prefix**: `{SERVICE_PREFIX}` (3-4 chars UPPERCASE, e.g., `PRD`, `ORD`, `USR`)
- **Entity Name**: `{EntityName}` (PascalCase, e.g., `Product`, `Order`, `User`)
- **Entity Variable**: `{entity}` (camelCase, e.g., `product`, `order`, `user`)
- **Entity Plural**: `{entities}` (lowercase, e.g., `products`, `orders`, `users`)
- **Table Name**: `{SERVICE_PREFIX}_{ENTITIES}` (SERVICE_PREFIX + UPPERCASE plural, <= 30 chars)
  - Examples: `USR_USERS`, `PRD_PRODUCTS`, `ORD_ORDERS`, `ORG_ORGANIZATIONS`
- **Proto Package**: `{service-name}` (same as service name)
- **gRPC Service**: `{EntityName}Service` (PascalCase + Service)

### 📋 Ví dụ cụ thể: Service "User"

**Service Structure:**
- Service name: `users` (kebab-case)
- Service prefix: `USR` (3 chars abbreviation)
- Service folder: `microservices/users-svc/`
- Entity class: `User` (PascalCase)
- Entity file: `user.entity.ts`
- Table name: `USR_USERS` (SERVICE_PREFIX + UPPERCASE plural, 9 chars - OK)

**Code Example:**
```typescript
// File: microservices/users-svc/src/users/entities/user.entity.ts
@Entity('USR_USERS') // Table name: USR_USERS (9 chars - OK)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    name: 'LOGIN_ID', // Column: LOGIN_ID (7 chars - OK)
    type: 'varchar2', 
    length: 100 
  })
  loginId: string;

  @Column({ 
    name: 'FULL_NAME', // Column: FULL_NAME (9 chars - OK)
    type: 'varchar2', 
    length: 255 
  })
  fullName: string;

  @Column({ 
    name: 'EMAIL_ADDR', // Column: EMAIL_ADDR (10 chars - OK)
    type: 'varchar2', 
    length: 255 
  })
  emailAddress: string;

  @CreateDateColumn({ 
    name: 'CREATED_AT', // Column: CREATED_AT (10 chars - OK)
    type: 'timestamp' 
  })
  createdAt: Date;

  @UpdateDateColumn({ 
    name: 'UPDATED_AT', // Column: UPDATED_AT (10 chars - OK)
    type: 'timestamp' 
  })
  updatedAt: Date;

  @VersionColumn({ name: 'VERSION' }) // Column: VERSION (7 chars - OK)
  version: number;
}
```

**Ví dụ với tên dài (cần rút gọn):**
```typescript
// ❌ BAD - Tên quá dài
@Column({ name: 'USER_AUTHENTICATION_TOKEN', ... }) // 25 chars - OK nhưng dài
userAuthenticationToken: string;

// ✅ GOOD - Rút gọn nhưng vẫn rõ nghĩa
@Column({ name: 'USR_AUTH_TOKEN', type: 'varchar2', length: 255 }) // 14 chars - OK
userAuthenticationToken: string;

// ❌ BAD - Quá 32 ký tự
@Column({ name: 'USER_AUTHENTICATION_TOKEN_EXPIRY_DATE', ... }) // 38 chars - TOO LONG!

// ✅ GOOD - Rút gọn
@Column({ name: 'USR_AUTH_TKN_EXP_DT', type: 'timestamp' }) // 19 chars - OK
userAuthenticationTokenExpiryDate: Date;
```

## 🔄 TypeORM vs Sequelize Differences

### Key Changes:
1. **Entity Decorators**: `@Entity()` thay vì `@Table()`
2. **Column Types**: `@Column('varchar2')` cho Oracle thay vì `DataType.STRING`
3. **Repository**: `Repository<Entity>` thay vì `Model`
4. **Injection**: `@InjectRepository()` thay vì `@InjectModel()`
5. **Find Options**: `FindManyOptions`, `FindOneOptions` thay vì `FindOptions`
6. **Create**: `repository.create()` + `repository.save()` thay vì `model.create()`
7. **Update**: `repository.update()` + `repository.findOne()` thay vì `model.update()`
8. **Delete**: `repository.delete()` thay vì `model.destroy()`
9. **No Sync**: TypeORM dùng migrations thay vì `db.sync()`
10. **Module Import**: `TypeOrmModule.forFeature([Entity])` thay vì `addModels()`

## 🗄️ Oracle 12c Specific Notes

### Column Types Mapping:
- `varchar` → `varchar2` (Oracle standard)
- `text` → `clob` (for large text)
- `integer` → `number` (Oracle number type)
- `bigint` → `number(19,0)` (for large integers)
- `decimal` → `number(precision, scale)`
- `boolean` → `number(1,0)` (0/1) hoặc `char(1)` ('Y'/'N')
- `date` → `date` hoặc `timestamp`
- `uuid` → `varchar2(36)` hoặc `raw(16)`

### Naming Examples:
```typescript
// ✅ GOOD - <= 32 characters
@Column({ name: 'USER_AUTH_TOKEN', type: 'varchar2', length: 255 })
userAuthenticationToken: string;

@Column({ name: 'CREATED_AT', type: 'timestamp' })
createdAt: Date;

// ❌ BAD - Too long (> 32 chars)
@Column({ name: 'USER_AUTHENTICATION_TOKEN_EXPIRY_DATE', ... }) // 38 chars!
userAuthenticationTokenExpiryDate: Date;

// ✅ GOOD - Abbreviated
@Column({ name: 'USR_AUTH_TKN_EXP_DT', type: 'timestamp' }) // 19 chars
userAuthenticationTokenExpiryDate: Date;
```

### Connection String Format:
```
// Using Service Name (recommended)
host:port/service_name
// Example: localhost:1521/XEPDB1

// Using SID (legacy)
host:port:sid
// Example: localhost:1521:XE
```

## 🔄 Quick Reference

### Replace Placeholders

When implementing, replace:
- `{service-name}` → actual service name (e.g., `products`)
- `{SERVICE_PREFIX}` → 3-4 char UPPERCASE prefix (e.g., `PRD`, `USR`, `ORD`)
- `{EntityName}` → PascalCase entity name (e.g., `Product`)
- `{entity}` → camelCase entity name (e.g., `product`)
- `{entities}` → plural lowercase (e.g., `products`)
- `{ENTITIES}` → UPPERCASE plural (e.g., `PRODUCTS`)
- `{SERVICE_PREFIX}_{ENTITIES}` → Table name (e.g., `PRD_PRODUCTS`, `USR_USERS`)

### Service Prefix Examples:

| Service Name | Prefix | Table Name | Length |
|-------------|--------|------------|--------|
| `users` | `USR` | `USR_USERS` | 9 |
| `products` | `PRD` | `PRD_PRODUCTS` | 12 |
| `orders` | `ORD` | `ORD_ORDERS` | 10 |
| `organizations` | `ORG` | `ORG_ORGANIZATIONS` | 17 |
| `user-profiles` | `USRP` | `USRP_USER_PROFILES` | 18 |
| `product-categories` | `PRDC` | `PRDC_PRODUCT_CATEGORIES` | 23 |
| `order-items` | `ORDI` | `ORDI_ORDER_ITEMS` | 15 |

### File Naming

- Entities: `{entity}.entity.ts`
- DTOs: `create-{entity}.dto.ts`, `update-{entity}.dto.ts`, `{entity}-response.dto.ts`
- Commands: `create-{entity}.command.ts`
- Queries: `get-{entity}s.query.ts`
- Handlers: `create-{entity}.handler.ts`, `get-{entity}s.handler.ts`

## 🎯 Best Practices Reminders

1. ✅ Always use Repository Pattern for data access (TypeORM Repository)
2. ✅ Separate Commands (writes) and Queries (reads) using CQRS
3. ✅ Add validation to DTOs using class-validator
4. ✅ Add Swagger documentation to all endpoints
5. ✅ Use proper HTTP status codes
6. ✅ Add logging to all operations
7. ✅ Handle errors consistently
8. ✅ Follow naming conventions
9. ✅ Update docker-compose.yaml
10. ✅ Update environment variables
11. ✅ Use TypeORM migrations in production (disable synchronize)
12. ✅ Use `TypeOrmModule.forFeature()` in feature modules
13. ✅ Inject repositories using `@InjectRepository()` decorator
14. ✅ **Oracle 12c**: Keep all field/column names <= 32 characters
15. ✅ **Oracle 12c**: Use UPPERCASE for table and column names
16. ✅ **Oracle 12c**: Always specify `name` property in `@Column()` decorator
17. ✅ **Oracle 12c**: Use `varchar2` instead of `varchar`
18. ✅ **Oracle 12c**: Use `SYSTIMESTAMP` for default timestamp values
19. ✅ **Oracle 12c**: Test migrations before deploying to production

## 📚 Additional Resources

- See `organizations-svc` as reference implementation
- Check `USAGE_GUIDE.md` for API usage examples
- Review `IMPLEMENTATION_PROGRESS.md` for architecture details
- [TypeORM Documentation](https://typeorm.io/)
- [NestJS TypeORM Integration](https://docs.nestjs.com/techniques/database#typeorm-integration)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [Oracle Database 12c Documentation](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/)
- [Oracle Naming Rules](https://docs.oracle.com/en/database/oracle/oracle-database/12.2/sqlrf/Database-Object-Names-and-Qualifiers.html)
- [oracledb Node.js Driver](https://oracle.github.io/node-oracledb/)
- [TypeORM Oracle Support](https://typeorm.io/data-source-options#oracle-data-source-options)

