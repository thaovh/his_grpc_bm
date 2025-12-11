# Integration Service Extension Guide

Hướng dẫn mở rộng Integration Service để hỗ trợ Data Enrichment: Query External Databases + Integration API + Lưu vào Local DB.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [Raw Queries Organization](#raw-queries-organization)
5. [Implementation Patterns](#implementation-patterns)
6. [Step-by-Step Guide](#step-by-step-guide)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

## 🎯 Overview

### Mục đích
Mở rộng `integration-svc` để hỗ trợ:
- **Query External Databases**: Chạy SQL queries trên các database bên ngoài với điều kiện
- **Call Integration API**: Gọi HIS API hoặc các API khác để enrich data
- **Merge Data**: Kết hợp dữ liệu từ SQL + API
- **Save to Local DB**: Lưu dữ liệu đã được enrich vào local database qua gRPC

### Flow Pattern

```
1. Query External DB (với điều kiện)
   ↓
2. Với mỗi record → Gọi Integration API để enrich
   ↓
3. Merge: {SQL Data} + {API Data} = Complete Data
   ↓
4. Transform & Validate
   ↓
5. Lưu vào Local DB (qua gRPC)
```

## 🏗️ Architecture

### Component Diagram

```
┌─────────────────────────────────────────┐
│         Integration Service             │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   External DB Provider           │  │
│  │   - Connection Pool Management   │  │
│  │   - Execute SQL Queries           │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   Query Loader                   │  │
│  │   - Load SQL from files          │  │
│  │   - Replace parameters           │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   Data Enrichment Service        │  │
│  │   - Orchestrate enrichment flow  │  │
│  │   - Call Integration APIs        │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   Data Merge Service             │  │
│  │   - Merge SQL + API data         │  │
│  │   - Apply merge strategies       │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   Enrichment Jobs                │  │
│  │   - Users Enrichment             │  │
│  │   - Products Enrichment          │  │
│  └──────────────────────────────────┘  │
│              │                          │
│              ▼                          │
│  ┌──────────────────────────────────┐  │
│  │   gRPC Clients                   │  │
│  │   - users-svc                    │  │
│  │   - products-svc                  │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📁 Folder Structure

### Cấu trúc thư mục mở rộng

```
integration-svc/
├── src/
│   ├── _proto/
│   │   ├── integration.proto          # Update: Thêm enrichment messages
│   │   └── ...
│   ├── integration/
│   │   ├── providers/
│   │   │   ├── his.provider.ts        # ✅ Existing
│   │   │   └── external-db.provider.ts # 🆕 NEW
│   │   ├── queries/                   # 🆕 NEW: Raw SQL queries
│   │   │   ├── external-db/
│   │   │   │   ├── users.query.sql
│   │   │   │   ├── products.query.sql
│   │   │   │   └── orders.query.sql
│   │   │   └── query-loader.ts        # 🆕 NEW: Load SQL files
│   │   ├── services/
│   │   │   ├── integration.service.ts  # ✅ Existing
│   │   │   ├── redis.service.ts       # ✅ Existing
│   │   │   ├── user-sync.service.ts   # ✅ Existing
│   │   │   ├── data-enrichment.service.ts # 🆕 NEW
│   │   │   └── data-merge.service.ts  # 🆕 NEW
│   │   ├── enrichment/                # 🆕 NEW: Enrichment jobs
│   │   │   └── jobs/
│   │   │       ├── users-enrichment.job.ts
│   │   │       └── products-enrichment.job.ts
│   │   ├── controllers/
│   │   │   └── integration.controller.ts # Update: Thêm methods
│   │   └── integration.module.ts      # Update: Register new services
│   └── ...
```

## 📝 Raw Queries Organization

### Quy tắc tổ chức Raw Queries

#### 1. **Khi nào dùng SQL Files?**

✅ **Dùng SQL Files** khi:
- Query phức tạp (> 10 dòng)
- Query có JOIN nhiều tables
- Query có subqueries
- Query được reuse nhiều lần
- Query cần review riêng

❌ **Dùng Inline** khi:
- Query đơn giản (< 10 dòng)
- Query có nhiều dynamic conditions
- Query chỉ dùng 1 lần
- Query cần template strings

#### 2. **Naming Convention**

```
queries/
└── external-db/
    ├── {entity}.query.sql           # Single entity query
    ├── {entity}-{action}.query.sql  # Specific action (e.g., users-active.query.sql)
    └── {entity}-{condition}.query.sql # With condition (e.g., users-by-department.query.sql)
```

**Examples:**
- `users.query.sql` - Get all users
- `users-active.query.sql` - Get active users
- `users-by-department.query.sql` - Get users by department
- `products-with-categories.query.sql` - Products with category info

#### 3. **SQL File Format**

```sql
-- File: queries/external-db/users.query.sql
-- Description: Get users with department information
-- Parameters: :department (optional), :isActive (optional)
-- Returns: USER_ID, USERNAME, EMAIL, FULL_NAME, DEPARTMENT, IS_ACTIVE

SELECT 
  u.USER_ID,
  u.USERNAME,
  u.EMAIL,
  u.FULL_NAME,
  u.DEPARTMENT,
  d.DEPARTMENT_NAME,
  u.IS_ACTIVE,
  u.CREATED_DATE
FROM EXTERNAL_USERS u
LEFT JOIN EXTERNAL_DEPARTMENTS d ON u.DEPARTMENT_ID = d.DEPARTMENT_ID
WHERE 1=1
  AND (:department IS NULL OR u.DEPARTMENT = :department)
  AND (:isActive IS NULL OR u.IS_ACTIVE = :isActive)
ORDER BY u.CREATED_DATE DESC
```

**Quy tắc:**
- Luôn có comment header mô tả query
- List tất cả parameters
- List các columns return
- Sử dụng `WHERE 1=1` để dễ thêm conditions
- Sử dụng `:paramName` cho bind parameters
- Format code dễ đọc (indent, line breaks)

#### 4. **Query Loader Pattern**

```typescript
// queries/query-loader.ts
export class QueryLoader {
  private static cache: Map<string, string> = new Map();

  static load(queryName: string): string {
    // Load from cache or file
  }

  static loadWithParams(queryName: string, params: Record<string, any>): string {
    // Load and replace placeholders
  }
}
```

## 🔧 Implementation Patterns

### Pattern 1: External DB Provider

```typescript
@Injectable()
export class ExternalDbProvider {
  // Connection pool management
  // Execute SQL queries
  // Handle errors
}
```

**Responsibilities:**
- Manage connection pools
- Execute SQL queries
- Handle connection errors
- Log query execution

### Pattern 2: Data Enrichment Service

```typescript
@Injectable()
export class DataEnrichmentService {
  async enrichAndSave(config: EnrichmentConfig): Promise<EnrichmentResult> {
    // 1. Query SQL
    // 2. For each record → Call API
    // 3. Merge data
    // 4. Save to local DB
  }
}
```

**Responsibilities:**
- Orchestrate enrichment flow
- Call Integration APIs
- Handle errors per record
- Return summary results

### Pattern 3: Data Merge Service

```typescript
@Injectable()
export class DataMergeService {
  merge(sqlData: any, apiData: any, strategy: MergeStrategy): any {
    // Merge SQL + API data
  }
}
```

**Merge Strategies:**
- `override`: API data overrides SQL data
- `merge`: Deep merge, API takes precedence
- `append`: Append API data as nested object

### Pattern 4: Enrichment Job

```typescript
@Injectable()
export class UsersEnrichmentJob {
  async execute(conditions?: Record<string, any>): Promise<void> {
    // Configure enrichment
    // Call enrichment service
    // Handle results
  }
}
```

**Responsibilities:**
- Define enrichment configuration
- Set up SQL query + API calls
- Define merge rules
- Handle job execution

## 🚀 Step-by-Step Guide

### Step 1: Tạo External DB Provider

**File:** `microservices/integration-svc/src/integration/providers/external-db.provider.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as oracledb from 'oracledb';

export interface ExternalDbConfig {
  type: 'oracle' | 'mssql' | 'mysql' | 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  serviceName?: string;
  connectString?: string;
}

export interface QueryOptions {
  query: string;
  bindParams?: any;
  conditions?: Record<string, any>;
}

@Injectable()
export class ExternalDbProvider {
  private pools: Map<string, oracledb.Pool> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExternalDbProvider.name);
  }

  async executeQuery(
    dbName: string,
    config: ExternalDbConfig,
    options: QueryOptions
  ): Promise<any[]> {
    // Implementation
  }

  private async getConnectionPool(
    dbName: string,
    config: ExternalDbConfig
  ): Promise<oracledb.Pool> {
    // Implementation
  }
}
```

### Step 2: Tạo Query Loader

**File:** `microservices/integration-svc/src/integration/queries/query-loader.ts`

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

export class QueryLoader {
  private static cache: Map<string, string> = new Map();

  static load(queryName: string): string {
    // Load from file or cache
  }

  static loadWithParams(
    queryName: string,
    params: Record<string, any>
  ): string {
    // Load and replace placeholders
  }
}
```

### Step 3: Tạo SQL Query Files

**File:** `microservices/integration-svc/src/integration/queries/external-db/users.query.sql`

```sql
-- Get users with department information
-- Parameters: :department (optional), :isActive (optional)

SELECT 
  u.USER_ID,
  u.USERNAME,
  u.EMAIL,
  u.FULL_NAME,
  u.DEPARTMENT,
  u.IS_ACTIVE
FROM EXTERNAL_USERS u
WHERE 1=1
  AND (:department IS NULL OR u.DEPARTMENT = :department)
  AND (:isActive IS NULL OR u.IS_ACTIVE = :isActive)
ORDER BY u.CREATED_DATE DESC
```

### Step 4: Tạo Data Merge Service

**File:** `microservices/integration-svc/src/integration/services/data-merge.service.ts`

```typescript
@Injectable()
export class DataMergeService {
  merge(
    sqlData: any,
    apiData: any,
    strategy: MergeStrategy,
    rules?: Record<string, string>
  ): any {
    // Implementation
  }
}
```

### Step 5: Tạo Data Enrichment Service

**File:** `microservices/integration-svc/src/integration/services/data-enrichment.service.ts`

```typescript
@Injectable()
export class DataEnrichmentService {
  async enrichAndSave(config: EnrichmentConfig): Promise<EnrichmentResult> {
    // Implementation
  }
}
```

### Step 6: Tạo Enrichment Job

**File:** `microservices/integration-svc/src/integration/enrichment/jobs/users-enrichment.job.ts`

```typescript
@Injectable()
export class UsersEnrichmentJob {
  async execute(conditions?: Record<string, any>): Promise<void> {
    // Implementation
  }
}
```

### Step 7: Update Integration Module

**File:** `microservices/integration-svc/src/integration/integration.module.ts`

```typescript
@Module({
  providers: [
    // Existing
    IntegrationServiceImpl,
    HisProvider,
    RedisService,
    UserSyncService,
    // NEW
    ExternalDbProvider,
    DataEnrichmentService,
    DataMergeService,
    UsersEnrichmentJob,
  ],
})
export class IntegrationModule {}
```

### Step 8: Update Proto File

**File:** `_proto/integration.proto`

```protobuf
// Add new messages
message EnrichDataRequest {
  string sourceDb = 1;
  string sqlQuery = 2;
  map<string, string> conditions = 3;
  string apiMethod = 4;
  string targetService = 5;
}

message EnrichDataResponse {
  bool success = 1;
  int32 totalRecords = 2;
  int32 processedRecords = 3;
  int32 failedRecords = 4;
}

// Add new RPC
service IntegrationService {
  // Existing methods...
  rpc enrichData (EnrichDataRequest) returns (EnrichDataResponse) {}
}
```

## ✅ Best Practices

### 1. **SQL Query Best Practices**

- ✅ Luôn sử dụng bind parameters (`:paramName`)
- ✅ Không bao giờ concatenate user input vào SQL
- ✅ Sử dụng `WHERE 1=1` để dễ thêm conditions
- ✅ Format code dễ đọc
- ✅ Comment mô tả query, parameters, returns
- ✅ Test queries trước khi commit

### 2. **Error Handling**

- ✅ Log chi tiết errors
- ✅ Continue processing nếu 1 record fail
- ✅ Return summary với success/failed counts
- ✅ Track errors per record

### 3. **Performance**

- ✅ Sử dụng connection pooling
- ✅ Process records in batches
- ✅ Cache SQL queries
- ✅ Log execution time

### 4. **Configuration**

- ✅ External DB config trong `.env`
- ✅ Query paths trong config
- ✅ Batch sizes configurable
- ✅ Retry logic configurable

## 📚 Examples

### Example 1: Simple Enrichment Job

```typescript
@Injectable()
export class UsersEnrichmentJob {
  constructor(
    private readonly enrichmentService: DataEnrichmentService,
  ) {}

  async execute(conditions?: { department?: string }): Promise<void> {
    const config: EnrichmentConfig = {
      sourceDb: 'external-users-db',
      sourceDbConfig: { /* ... */ },
      sqlQuery: QueryLoader.load('users.query.sql'),
      sqlConditions: conditions,
      apiProvider: 'his',
      apiMethod: 'getUserRoles',
      mergeStrategy: 'merge',
      targetService: 'users-svc',
      targetMethod: 'create',
    };

    await this.enrichmentService.enrichAndSave(config);
  }
}
```

### Example 2: Complex Query với JOIN

```sql
-- queries/external-db/users-with-departments.query.sql
SELECT 
  u.USER_ID,
  u.USERNAME,
  u.EMAIL,
  d.DEPARTMENT_NAME,
  d.DEPARTMENT_CODE
FROM EXTERNAL_USERS u
INNER JOIN EXTERNAL_DEPARTMENTS d ON u.DEPARTMENT_ID = d.DEPARTMENT_ID
WHERE u.IS_ACTIVE = 1
```

### Example 3: Dynamic Conditions

```typescript
const conditions = {
  department: 'IT',
  isActive: 1,
  startDate: '2024-01-01',
};

const query = QueryLoader.loadWithParams('users.query.sql', conditions);
```

## 📋 Checklist

### Development Checklist

- [ ] Tạo `ExternalDbProvider`
- [ ] Tạo `QueryLoader`
- [ ] Tạo SQL query files trong `queries/external-db/`
- [ ] Tạo `DataMergeService`
- [ ] Tạo `DataEnrichmentService`
- [ ] Tạo enrichment jobs
- [ ] Update `integration.module.ts`
- [ ] Update `integration.proto`
- [ ] Update `integration.controller.ts`
- [ ] Update `integration.interface.ts`
- [ ] Add environment variables
- [ ] Add error handling
- [ ] Add logging
- [ ] Write tests

### Testing Checklist

- [ ] Test SQL query loading
- [ ] Test external DB connection
- [ ] Test query execution
- [ ] Test API integration calls
- [ ] Test data merging
- [ ] Test error handling
- [ ] Test batch processing
- [ ] Test with real data

## 🔍 Troubleshooting

### Common Issues

1. **SQL File Not Found**
   - Check file path
   - Check file extension (.sql)
   - Check query name

2. **Connection Pool Errors**
   - Check DB credentials
   - Check network connectivity
   - Check pool size

3. **Parameter Binding Errors**
   - Check parameter names match
   - Check parameter types
   - Check null handling

## 📖 References

- [Oracle Database Documentation](https://docs.oracle.com/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)

---

**Last Updated:** 2025-01-11
**Version:** 1.0.0

