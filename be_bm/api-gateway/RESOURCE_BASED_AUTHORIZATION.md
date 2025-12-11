# Resource-Based Authorization Guide

## Overview

Hệ thống hỗ trợ **hybrid authorization**:
- **Resource-based**: Sử dụng `@Resource()` và `@Action()` decorators (ưu tiên)
- **Path-based**: Fallback về path matching nếu không có decorators

## Benefits

1. **Dễ maintain**: Không phụ thuộc vào path structure
2. **Refactor-friendly**: Thay đổi route không ảnh hưởng authorization
3. **Clear intent**: Resource và action rõ ràng hơn path
4. **Kong sync**: Vẫn giữ path cho Kong Gateway routing

## Usage

### 1. Basic Usage (Recommended - Auto-infer Action)

**Chỉ cần `@Resource()` - Action sẽ tự động được infer từ HTTP method + path:**

```typescript
import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { Resource } from '../common/decorators/resource.decorator';

@Controller('users')
export class UsersController {
  @Get()
  @Resource('users')
  // Action tự động infer: 'list' (GET without :id)
  async findAll() {
    // Guard sẽ check: resource='users', action='list', method='GET'
  }

  @Get(':id')
  @Resource('users')
  // Action tự động infer: 'read' (GET with :id)
  async findById(@Param('id') id: string) {
    // Guard sẽ check: resource='users', action='read', method='GET'
  }

  @Post()
  @Resource('users')
  // Action tự động infer: 'create' (POST)
  async create(@Body() dto: CreateUserDto) {
    // Guard sẽ check: resource='users', action='create', method='POST'
  }

  @Put(':id')
  @Resource('users')
  // Action tự động infer: 'update' (PUT)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // Guard sẽ check: resource='users', action='update', method='PUT'
  }

  @Delete(':id')
  @Resource('users')
  // Action tự động infer: 'delete' (DELETE)
  async delete(@Param('id') id: string) {
    // Guard sẽ check: resource='users', action='delete', method='DELETE'
  }
}
```

### 1.1 Custom Actions (Explicit @Action() needed)

**Chỉ cần `@Action()` khi action không thể infer được:**

```typescript
import { Resource, Action } from '../common/decorators/resource.decorator';

@Controller('inventory')
export class InventoryController {
  @Post('exp-mests/:id/sync')
  @Resource('inventory.exp-mests')
  // Action tự động infer: 'sync' (POST + path contains '/sync')
  async sync(@Param('id') id: string) {
    // Guard sẽ check: resource='inventory.exp-mests', action='sync', method='POST'
  }

  @Put('exp-mests/medicines/export')
  @Resource('inventory.exp-mests')
  // Action tự động infer: 'export' (PUT + path contains '/export')
  async exportMedicines() {
    // Guard sẽ check: resource='inventory.exp-mests', action='export', method='PUT'
  }

  @Get('exp-mests/:id/advanced-report')
  @Resource('inventory.exp-mests')
  @Action('advanced-report')  // Explicit action needed for custom cases
  async getAdvancedReport(@Param('id') id: string) {
    // Guard sẽ check: resource='inventory.exp-mests', action='advanced-report', method='GET'
  }
}
```

### 2. Nested Resources

```typescript
@Controller('inventory')
export class InventoryController {
  @Get('exp-mests')
  @Resource('inventory.exp-mests')
  // Action tự động infer: 'list'
  async findAll() {
    // Resource name có thể dùng dot notation
  }

  @Get('exp-mests/:id')
  @Resource('inventory.exp-mests')
  // Action tự động infer: 'read'
  async findById(@Param('id') id: string) {
    // ...
  }

  @Post('exp-mests-other/:expMestId/sync')
  @Resource('inventory.exp-mests-other')
  // Action tự động infer: 'sync' (POST + path contains '/sync')
  async sync(@Param('expMestId') expMestId: string) {
    // Custom actions như 'sync', 'export' được tự động detect
  }
}
```

### 3. Without Decorators (Fallback)

Nếu không có `@Resource()` và `@Action()`, guard sẽ fallback về path-based matching:

```typescript
@Controller('legacy')
export class LegacyController {
  @Get('old-endpoint')
  // Không có decorators → Guard sẽ query DB bằng path: '/api/legacy/old-endpoint'
  async oldEndpoint() {
    // ...
  }
}
```

## Action Inference Rules

Guard tự động infer action từ HTTP method + path pattern:

### Standard CRUD Actions (Auto-inferred)

| HTTP Method | Path Pattern | Inferred Action | Example |
|------------|--------------|-----------------|---------|
| GET | `/resource` (no :id) | `list` | `GET /users` → `list` |
| GET | `/resource/:id` | `read` | `GET /users/:id` → `read` |
| POST | `/resource` | `create` | `POST /users` → `create` |
| PUT/PATCH | `/resource/:id` | `update` | `PUT /users/:id` → `update` |
| DELETE | `/resource/:id` | `delete` | `DELETE /users/:id` → `delete` |

### Custom Actions (Auto-detected from path)

| Path Contains | Inferred Action | Example |
|--------------|-----------------|---------|
| `/sync` | `sync` | `POST /exp-mests/:id/sync` → `sync` |
| `/export` | `export` | `PUT /exp-mests/medicines/export` → `export` |
| `/actual-export` | `actual-export` | `PUT /exp-mests/medicines/actual-export` → `actual-export` |
| `/summary` | `read` | `GET /exp-mests/:id/summary` → `read` |
| `/import` | `import` | `POST /data/import` → `import` |

### Explicit Action (Use @Action() decorator)

Chỉ cần khi action không match các pattern trên:

```typescript
@Get('exp-mests/:id/advanced-report')
@Resource('inventory.exp-mests')
@Action('advanced-report')  // Explicit action needed
async getAdvancedReport() { }
```

## Database Configuration

### 1. Run Migration

```sql
-- Run migration script
@microservices/gateway-config-svc/database/migration-add-resource-action.sql
```

### 2. Configure Endpoints

Có 2 cách:

**Option A: Via Admin API** (Recommended)
```bash
POST /api/gateway-config/endpoints
{
  "path": "/api/users",
  "method": "GET",
  "resourceName": "users",
  "action": "list",
  "isPublic": false,
  "roleCodes": ["ADMIN", "USER"],
  "module": "users"
}
```

**Option B: Direct SQL**
```sql
UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'list' 
WHERE PATH = '/api/users' AND METHOD = 'GET';
```

## How It Works

### Authorization Flow

```
Request → DynamicRolesGuard
    ↓
1. Check @Resource() and @Action() decorators
    ├─ YES → Query DB by resource + action + method
    └─ NO → Fallback to path-based matching
        ├─ Try exact path match
        └─ Try normalized path pattern
    ↓
2. Check endpoint config from DB
    ├─ isPublic = true → Allow
    └─ isPublic = false → Check roles
        ├─ User has required role → Allow
        └─ User doesn't have role → Deny (403)
```

### Cache Strategy

- **Resource-based**: Cache key = `METHOD:RESOURCE:ACTION`
  - Example: `GET:users:list`
- **Path-based**: Cache key = `METHOD:NORMALIZED_PATH`
  - Example: `GET:/api/users/:id`

## Migration Strategy

### Phase 1: Add Decorators Gradually

1. Thêm decorators vào các endpoint mới
2. Giữ path-based cho các endpoint cũ
3. Guard tự động fallback nếu không tìm thấy resource-based config

### Phase 2: Migrate Existing Endpoints

1. Update DB với resource + action cho các endpoint hiện có
2. Thêm decorators vào controllers
3. Test và verify

### Phase 3: Full Migration (Optional)

1. Tất cả endpoints đều có resource + action
2. Có thể remove path-based fallback nếu muốn (không khuyến nghị)

## Examples

### Example 1: Users Module

```typescript
@Controller('users')
export class UsersController {
  @Get()
  @Resource('users')
  // Action auto-inferred: 'list'
  async findAll() { }

  @Get(':id')
  @Resource('users')
  // Action auto-inferred: 'read'
  async findById(@Param('id') id: string) { }

  @Get('username/:username')
  @Resource('users')
  // Action auto-inferred: 'read' (GET with parameter)
  async findByUsername(@Param('username') username: string) { }
  // Note: Cùng resource và action nhưng khác path
}
```

### Example 2: Inventory Module

```typescript
@Controller('inventory')
export class InventoryController {
  @Get('exp-mests')
  @Resource('inventory.exp-mests')
  // Action auto-inferred: 'list'
  async findAll() { }

  @Get('exp-mests/:id')
  @Resource('inventory.exp-mests')
  // Action auto-inferred: 'read'
  async findById(@Param('id') id: string) { }

  @Post('exp-mests-other/:expMestId/sync')
  @Resource('inventory.exp-mests-other')
  // Action auto-inferred: 'sync' (path contains '/sync')
  async sync(@Param('expMestId') expMestId: string) { }

  @Put('exp-mests/medicines/export')
  @Resource('inventory.exp-mests')
  // Action auto-inferred: 'export' (path contains '/export')
  async exportMedicines() { }
}
```

## Best Practices

1. **Consistent naming**: Dùng naming convention nhất quán
   - Resource: `users`, `inventory.exp-mests`, `master-data.departments`
   - Action: `list`, `read`, `create`, `update`, `delete`

2. **Group related endpoints**: Dùng cùng resource name cho các endpoints liên quan

3. **Keep path for Kong**: Luôn giữ path trong DB để sync với Kong Gateway

4. **Gradual migration**: Migrate từng module một, không cần làm hết một lúc

5. **Documentation**: Document resource và action mapping trong code comments

## Troubleshooting

### Issue: Endpoint not found

**Symptom**: `Endpoint not configured. Please contact administrator.`

**Solution**:
1. Check xem có `@Public()` decorator không
2. Check DB có endpoint với resource + action hoặc path tương ứng không
3. Check logs để xem guard đã thử những cách nào

### Issue: Wrong permissions

**Symptom**: User có role nhưng vẫn bị deny

**Solution**:
1. Check DB: `SELECT * FROM GW_API_ENDPOINTS WHERE RESOURCE_NAME = '...' AND ACTION = '...'`
2. Check roles mapping: `SELECT * FROM GW_API_ENDPOINT_ROLES WHERE ENDPOINT_ID = '...'`
3. Check user roles trong JWT token

## See Also

- `api-gateway/src/common/guards/dynamic-roles.guard.ts` - Guard implementation
- `api-gateway/src/common/decorators/resource.decorator.ts` - Decorator definitions
- `microservices/gateway-config-svc/src/api-endpoints/` - Endpoint management
