# API Gateway Refactor Plan - Complete 4 Phases

## 📋 Overview

**Mục tiêu tổng thể:** Di chuyển business logic từ API Gateway vào các microservices để tuân thủ microservices best practices.

**Thời gian ước tính tổng thể:** 6-8 tuần

**Phạm vi:**
- Phase 1: Inventory Module (2-3 tuần)
- Phase 2: Integration Module (1-2 tuần)
- Phase 3: Machine Module (1 tuần)
- Phase 4: Testing & Cleanup (1 tuần)

---

## 🎯 Objectives

1. **Separation of Concerns**: Gateway chỉ làm routing/protocol translation
2. **Scalability**: Business logic có thể scale độc lập
3. **Testability**: Dễ test business logic riêng biệt
4. **Maintainability**: Code dễ maintain hơn
5. **Reusability**: Business logic có thể reuse từ services khác

---

# Phase 1: Inventory Module Refactor

## 📦 Current State Analysis

### Business Logic hiện tại ở Gateway

#### 1. Aggregation Logic
- **Location**: `api-gateway/src/inventory/inventory.controller.ts`
- **Methods**:
  - `buildExpMestSummary()` (lines 2733-2895)
  - `getInpatientExpMestSummary()` (lines 967-1305)

**Chức năng:**
- Group medicines theo `medicineTypeCode`
- Aggregate `amount`, `hisIds`
- Tính `is_exported`, `is_actual_exported`
- Enrich user info
- Sort medicines

#### 2. Enrichment Logic
- **Location**: `api-gateway/src/inventory/inventory.service.ts`
- **Methods**:
  - `enrichWithExportStatus()` (lines 210-253)
  - User info enrichment trong `buildExpMestSummary()` (lines 2839-2867)

**Chức năng:**
- Fetch `ExportStatus` từ `master-data-svc`
- Attach `working_state` vào exp-mest records
- Fetch user profile từ `users-svc`
- Attach `exportedByUserInfo`, `actualExportedByUserInfo`

#### 3. Business Rules
- **Location**: `api-gateway/src/inventory/inventory.controller.ts`
- **Methods**:
  - `checkAndEmitExpMestCabinetWorkingStateUpdate()` (lines 2537-2625)
  - `checkAndEmitExpMestOtherWorkingStateUpdate()` (lines 2630-2723)

**Chức năng:**
- Check tất cả medicines đã exported chưa
- Update `workingStateId` của parent
- Emit SSE events

---

## 🚀 Implementation Plan

### Step 1: Create Proto Definitions (Day 1-2)

#### 1.1. Add Summary Request/Response Messages

**File**: `microservices/inventory-svc/src/_proto/inventory.proto`

```protobuf
message GetExpMestCabinetSummaryRequest {
  int64 expMestId = 1; // HIS ID
  string orderBy = 2; // Optional sort field (e.g., "medicineName", "-amount")
}

message GetExpMestOtherSummaryRequest {
  int64 expMestId = 1; // HIS ID
  string orderBy = 2; // Optional sort field
}

message GetInpatientExpMestSummaryRequest {
  int64 expMestId = 1; // HIS ID (aggrExpMestId)
  string orderBy = 2; // Optional sort field
}

message MedicineSummary {
  string medicineCode = 1;
  string medicineName = 2;
  string serviceUnitCode = 3;
  string serviceUnitName = 4;
  double amount = 5;
  repeated int64 hisIds = 6;
  bool is_exported = 7;
  string exportedByUser = 8; // UUID
  int64 exportedTime = 9;
  bool is_actual_exported = 10;
  string actualExportedByUser = 11; // UUID
  int64 actualExportedTime = 12;
  UserInfo exportedByUserInfo = 13;
  UserInfo actualExportedByUserInfo = 14;
}

message UserInfo {
  string id = 1;
  string username = 2;
  string email = 3;
  string firstName = 4;
  string lastName = 5;
}

message ExpMestSummaryResponse {
  string expMestId = 1; // Local UUID
  int64 hisExpMestId = 2;
  string expMestCode = 3;
  string mediStockCode = 4;
  string mediStockName = 5;
  string reqDepartmentCode = 6;
  string reqDepartmentName = 7;
  string workingStateId = 8;
  ExportStatus working_state = 9;
  repeated MedicineSummary medicines = 10;
}

message ExportStatus {
  string id = 1;
  string code = 2;
  string name = 3;
  int32 sortOrder = 4;
  string createdAt = 5;
  string updatedAt = 6;
  string createdBy = 7;
  string updatedBy = 8;
  int32 version = 9;
  int32 isActive = 10;
}

message CheckAndUpdateWorkingStateRequest {
  int64 expMestId = 1; // HIS ID
  string expMestType = 2; // "cabinet" | "other" | "inpatient"
}

message CheckAndUpdateWorkingStateResponse {
  bool updated = 1;
  string oldWorkingStateId = 2;
  string newWorkingStateId = 3;
  string reason = 4;
  ExpMestSummaryResponse expMest = 5; // Updated exp mest data
}
```

#### 1.2. Add gRPC Service Methods

```protobuf
service InventoryService {
  // ... existing methods ...

  // Summary methods (NEW)
  rpc GetExpMestCabinetSummary (GetExpMestCabinetSummaryRequest) returns (ExpMestSummaryResponse) {}
  rpc GetExpMestOtherSummary (GetExpMestOtherSummaryRequest) returns (ExpMestSummaryResponse) {}
  rpc GetInpatientExpMestSummary (GetInpatientExpMestSummaryRequest) returns (ExpMestSummaryResponse) {}
  
  // Working state update methods (NEW)
  rpc CheckAndUpdateExpMestCabinetWorkingState (CheckAndUpdateWorkingStateRequest) returns (CheckAndUpdateWorkingStateResponse) {}
  rpc CheckAndUpdateExpMestOtherWorkingState (CheckAndUpdateWorkingStateRequest) returns (CheckAndUpdateWorkingStateResponse) {}
  rpc CheckAndUpdateInpatientExpMestWorkingState (CheckAndUpdateWorkingStateRequest) returns (CheckAndUpdateWorkingStateResponse) {}
}
```

### Step 2: Implement Services in inventory-svc (Day 3-7)

#### 2.1. Create Summary Service

**File**: `microservices/inventory-svc/src/inventory/services/exp-mest-summary.service.ts`

- Implement `buildExpMestSummary()` logic (migrated from Gateway)
- Implement `getExpMestCabinetSummary()`
- Implement `getExpMestOtherSummary()`
- Implement `getInpatientExpMestSummary()`
- Enrich với `working_state` từ `master-data-svc`
- Enrich với user info từ `users-svc`

#### 2.2. Create Working State Service

**File**: `microservices/inventory-svc/src/inventory/services/exp-mest-working-state.service.ts`

- Implement `checkAndUpdateExpMestCabinetWorkingState()` logic
- Implement `checkAndUpdateExpMestOtherWorkingState()` logic
- Emit events via EventEmitter2

#### 2.3. Create gRPC Controllers

**File**: `microservices/inventory-svc/src/inventory/controllers/exp-mest-summary-grpc.controller.ts`

- Map gRPC methods to service methods

### Step 3: Update API Gateway (Day 8-10)

#### 3.1. Update InventoryService Interface

- Add new gRPC method calls

#### 3.2. Update Controller Methods

- Replace `buildExpMestSummary()` calls với gRPC calls
- Replace `checkAndEmitWorkingStateUpdate()` calls với gRPC calls

#### 3.3. Remove Old Methods

- Remove `buildExpMestSummary()` from Gateway
- Remove `enrichWithExportStatus()` from Gateway (if not used elsewhere)
- Remove `checkAndEmitWorkingStateUpdate()` methods

### Step 4: Handle Dependencies (Day 11-12)

- Add Master Data gRPC client to inventory-svc
- Add Users gRPC client to inventory-svc
- Configure EventEmitter2 in inventory-svc

### Step 5: Testing (Day 13-15)

- Unit tests
- Integration tests
- E2E tests
- Manual testing

---

## ✅ Phase 1 Definition of Done

- [x] Proto definitions created và synced
- [x] Summary services implemented trong inventory-svc
- [x] Working state services implemented trong inventory-svc
- [x] gRPC controllers created và registered
- [x] API Gateway updated để gọi new gRPC methods
- [x] Old Gateway code removed
- [ ] Tests written và passing
- [ ] Documentation updated

---

# Phase 2: Integration Module Refactor

## 📦 Current State Analysis

### Business Logic hiện tại ở Gateway

#### 1. Sync Logic
- **Location**: `api-gateway/src/integration/integration.controller.ts`
- **Methods**:
  - `syncInpatientExpMest()` (lines 462-575)
  - `syncExpMestOther()` (lines 658-775)

**Chức năng:**
- Fetch từ HIS
- Check sync status
- Enrich với `working_state`
- Emit SSE events

#### 2. Aggregation Logic
- **Location**: `api-gateway/src/integration/integration.controller.ts`
- **Methods**:
  - `getInpatientExpMestSummaryFromHis()` (lines 2006-2274)

**Chức năng:**
- Group medicines từ HIS data
- Aggregate amounts, hisIds
- Sort medicines

#### 3. Data Enrichment
- **Location**: `api-gateway/src/integration/integration.controller.ts`
- **Methods**:
  - Enrich với `is_sync` flag (lines 635-639, 913-916, 1316-1317, 1603-1638)
  - Enrich với `working_state` (lines 876-886, 1563-1573)

**Chức năng:**
- Check trong local DB
- Attach `is_sync` flag
- Fetch từ master-data-svc
- Attach `working_state`

#### 4. Business Rules
- **Location**: `api-gateway/src/integration/integration.controller.ts`
- **Methods**:
  - Auto-update `expMestSttId` (lines 1608-1697)

**Chức năng:**
- Check và update nếu khác với HIS

---

## 🚀 Implementation Plan

### Step 1: Create Proto Definitions (Day 1-2)

#### 1.1. Add Sync Request/Response Messages

**File**: `microservices/integration-svc/src/_proto/integration.proto`

```protobuf
message SyncInpatientExpMestRequest {
  int64 expMestId = 1; // HIS ID
  string userId = 2;
}

message SyncExpMestOtherRequest {
  int64 expMestId = 1; // HIS ID
  string userId = 2;
}

message SyncResponse {
  bool success = 1;
  string message = 2;
  string expMestId = 3; // Local UUID
  int64 hisExpMestId = 4;
  string workingStateId = 5;
  ExportStatus working_state = 6;
}

message GetInpatientExpMestSummaryFromHisRequest {
  int64 expMestId = 1; // HIS ID (aggrExpMestId)
  string orderBy = 2;
  string userId = 3;
}

message InpatientExpMestSummaryFromHisResponse {
  int64 expMestId = 1;
  string expMestCode = 2;
  string mediStockCode = 3;
  string mediStockName = 4;
  string reqDepartmentCode = 5;
  string reqDepartmentName = 6;
  repeated MedicineSummary medicines = 7;
}

message EnrichExpMestsWithSyncStatusRequest {
  repeated int64 expMestIds = 1; // HIS IDs
  string expMestType = 2; // "inpatient" | "other"
}

message EnrichExpMestsWithSyncStatusResponse {
  map<int64, bool> syncStatusMap = 1; // expMestId -> is_sync
  map<int64, string> workingStateIdMap = 2; // expMestId -> workingStateId
  map<string, ExportStatus> workingStateMap = 3; // workingStateId -> ExportStatus
}

message AutoUpdateExpMestSttIdRequest {
  repeated int64 expMestIds = 1; // HIS IDs
  string expMestType = 2; // "inpatient" | "other"
}

message AutoUpdateExpMestSttIdResponse {
  int32 updatedCount = 1;
  repeated int64 updatedExpMestIds = 2;
}
```

#### 1.2. Add gRPC Service Methods

```protobuf
service IntegrationService {
  // ... existing methods ...

  // Sync methods (NEW)
  rpc SyncInpatientExpMest (SyncInpatientExpMestRequest) returns (SyncResponse) {}
  rpc SyncExpMestOther (SyncExpMestOtherRequest) returns (SyncResponse) {}
  
  // Summary methods (NEW)
  rpc GetInpatientExpMestSummaryFromHis (GetInpatientExpMestSummaryFromHisRequest) returns (InpatientExpMestSummaryFromHisResponse) {}
  
  // Enrichment methods (NEW)
  rpc EnrichExpMestsWithSyncStatus (EnrichExpMestsWithSyncStatusRequest) returns (EnrichExpMestsWithSyncStatusResponse) {}
  
  // Auto-update methods (NEW)
  rpc AutoUpdateExpMestSttId (AutoUpdateExpMestSttIdRequest) returns (AutoUpdateExpMestSttIdResponse) {}
}
```

### Step 2: Implement Services in integration-svc (Day 3-5)

#### 2.1. Create Sync Service

**File**: `microservices/integration-svc/src/integration/services/exp-mest-sync.service.ts`

- Implement `syncInpatientExpMest()` logic
- Implement `syncExpMestOther()` logic
- Call HIS API
- Call inventory-svc để sync vào DB
- Enrich với `working_state`
- Emit SSE events

#### 2.2. Create Summary Service

**File**: `microservices/integration-svc/src/integration/services/exp-mest-summary.service.ts`

- Implement `getInpatientExpMestSummaryFromHis()` logic
- Group medicines từ HIS data
- Aggregate amounts, hisIds
- Sort medicines

#### 2.3. Create Enrichment Service

**File**: `microservices/integration-svc/src/integration/services/exp-mest-enrichment.service.ts`

- Implement `enrichWithSyncStatus()` logic
- Check trong inventory-svc DB
- Fetch `working_state` từ master-data-svc
- Attach vào response

#### 2.4. Create Auto-Update Service

**File**: `microservices/integration-svc/src/integration/services/exp-mest-auto-update.service.ts`

- Implement auto-update `expMestSttId` logic
- Check differences với HIS
- Update trong inventory-svc

### Step 3: Update API Gateway (Day 6-7)

#### 3.1. Update IntegrationService Interface

- Add new gRPC method calls

#### 3.2. Update Controller Methods

- Replace sync logic với gRPC calls
- Replace summary logic với gRPC calls
- Replace enrichment logic với gRPC calls

#### 3.3. Remove Old Methods

- Remove sync logic from Gateway
- Remove aggregation logic from Gateway
- Remove enrichment logic from Gateway

### Step 4: Handle Dependencies (Day 8)

- Ensure integration-svc can call inventory-svc
- Ensure integration-svc can call master-data-svc
- Configure EventEmitter2 in integration-svc

### Step 5: Testing (Day 9-10)

- Unit tests
- Integration tests
- E2E tests
- Manual testing

---

## ✅ Phase 2 Definition of Done

- [ ] Proto definitions created và synced
- [ ] Sync services implemented trong integration-svc
- [ ] Summary services implemented trong integration-svc
- [ ] Enrichment services implemented trong integration-svc
- [ ] Auto-update services implemented trong integration-svc
- [ ] gRPC controllers created và registered
- [ ] API Gateway updated để gọi new gRPC methods
- [ ] Old Gateway code removed
- [ ] Tests written và passing
- [ ] Documentation updated

---

# Phase 3: Machine Module Refactor

## 📦 Current State Analysis

### Business Logic hiện tại ở Gateway

#### 1. Enrichment Logic
- **Location**: `api-gateway/src/machine/machine.controller.ts`
- **Methods**:
  - `enrichMachines()` (lines 88-150)

**Chức năng:**
- Fetch master data từ nhiều sources
- Attach `category`, `status`, `unit`, `vendor`, `branch`, `department`, `manufacturer`, etc.

#### 2. Business Rules
- **Location**: `api-gateway/src/machine/machine.controller.ts`
- **Methods**:
  - Auto-infer `branchId` từ `departmentId` (lines 179-184)

**Chức năng:**
- Lookup department
- Infer branchId

---

## 🚀 Implementation Plan

### Step 1: Create Proto Definitions (Day 1)

#### 1.1. Add Enrichment Request/Response Messages

**File**: `microservices/machine-svc/src/_proto/machine.proto`

```protobuf
message GetMachinesWithEnrichmentRequest {
  commons.Query query = 1;
}

message MachineEnrichment {
  MachineCategory category = 1;
  MachineStatus status = 2;
  MachineUnit unit = 3;
  Vendor vendor = 4;
  ManufacturerCountry manufacturerCountry = 5;
  MachineFundingSource fundingSource = 6;
  Branch branch = 7;
  Department department = 8;
  Manufacturer manufacturer = 9;
}

message MachineWithEnrichment {
  Machine machine = 1;
  MachineEnrichment enrichment = 2;
}

message MachineListWithEnrichment {
  repeated MachineWithEnrichment data = 1;
  commons.Count count = 2;
}
```

#### 1.2. Add gRPC Service Methods

```protobuf
service MachineService {
  // ... existing methods ...

  // Enrichment methods (NEW)
  rpc GetMachinesWithEnrichment (GetMachinesWithEnrichmentRequest) returns (MachineListWithEnrichment) {}
  rpc GetMachineWithEnrichmentById (commons.Id) returns (MachineWithEnrichment) {}
}
```

### Step 2: Implement Services in machine-svc (Day 2-3)

#### 2.1. Create Enrichment Service

**File**: `microservices/machine-svc/src/machine/services/machine-enrichment.service.ts`

- Implement `enrichMachines()` logic
- Fetch master data từ master-data-svc
- Attach enrichment data
- Handle auto-infer branchId logic

#### 2.2. Create gRPC Controllers

**File**: `microservices/machine-svc/src/machine/controllers/machine-enrichment-grpc.controller.ts`

- Map gRPC methods to service methods

### Step 3: Update API Gateway (Day 4)

#### 3.1. Update MachineService Interface

- Add new gRPC method calls

#### 3.2. Update Controller Methods

- Replace `enrichMachines()` calls với gRPC calls
- Remove auto-infer logic (move to microservice)

#### 3.3. Remove Old Methods

- Remove `enrichMachines()` from Gateway

### Step 4: Handle Dependencies (Day 5)

- Ensure machine-svc can call master-data-svc

### Step 5: Testing (Day 6-7)

- Unit tests
- Integration tests
- E2E tests
- Manual testing

---

## ✅ Phase 3 Definition of Done

- [ ] Proto definitions created và synced
- [ ] Enrichment services implemented trong machine-svc
- [ ] gRPC controllers created và registered
- [ ] API Gateway updated để gọi new gRPC methods
- [ ] Old Gateway code removed
- [ ] Tests written và passing
- [ ] Documentation updated

---

# Phase 4: Testing & Cleanup

## 📋 Overview

Phase này tập trung vào:
- Comprehensive testing cho tất cả phases
- Performance testing
- Code cleanup
- Documentation
- Final verification

---

## 🚀 Implementation Plan

### Step 1: Comprehensive Testing (Day 1-3)

#### 1.1. Unit Tests

**Files to create:**
- `microservices/inventory-svc/src/inventory/services/exp-mest-summary.service.spec.ts`
- `microservices/inventory-svc/src/inventory/services/exp-mest-working-state.service.spec.ts`
- `microservices/integration-svc/src/integration/services/exp-mest-sync.service.spec.ts`
- `microservices/integration-svc/src/integration/services/exp-mest-summary.service.spec.ts`
- `microservices/integration-svc/src/integration/services/exp-mest-enrichment.service.spec.ts`
- `microservices/machine-svc/src/machine/services/machine-enrichment.service.spec.ts`

**Test coverage target:** > 80%

#### 1.2. Integration Tests

**Files to create:**
- `microservices/inventory-svc/test/integration/exp-mest-summary.integration.spec.ts`
- `microservices/integration-svc/test/integration/exp-mest-sync.integration.spec.ts`
- `microservices/machine-svc/test/integration/machine-enrichment.integration.spec.ts`

**Test cases:**
- gRPC calls work correctly
- Cross-service communication works
- Error handling works correctly

#### 1.3. E2E Tests

**Files to create:**
- `api-gateway/test/e2e/inventory-summary.e2e.spec.ts`
- `api-gateway/test/e2e/integration-sync.e2e.spec.ts`
- `api-gateway/test/e2e/machine-enrichment.e2e.spec.ts`

**Test cases:**
- All API endpoints work correctly
- Response format matches current API
- Error responses are correct

#### 1.4. Performance Testing

**Test scenarios:**
- Compare response times before/after refactor
- Load testing với concurrent requests
- Memory usage testing
- Database query performance

**Target metrics:**
- Response time không tăng > 10%
- Memory usage không tăng > 15%
- Database queries optimized

### Step 2: Code Cleanup (Day 4-5)

#### 2.1. Remove Unused Code

- Remove all old business logic methods from Gateway
- Remove unused imports
- Remove unused dependencies nếu có

#### 2.2. Code Review

- Review all new code
- Check for code smells
- Refactor nếu cần
- Ensure consistent coding style

#### 2.3. Linting & Formatting

- Run linter và fix issues
- Format code consistently
- Remove console.logs
- Remove debug code

### Step 3: Documentation (Day 6)

#### 3.1. API Documentation

- Update Swagger documentation
- Document new gRPC methods
- Document response formats

#### 3.2. Architecture Documentation

- Update architecture diagrams
- Document new service boundaries
- Document data flow

#### 3.3. Developer Documentation

- Update README
- Document migration process
- Document new patterns
- Create troubleshooting guide

### Step 4: Final Verification (Day 7)

#### 4.1. Functional Verification

- [ ] All APIs work as expected
- [ ] All business logic works correctly
- [ ] All events are emitted correctly
- [ ] All enrichments work correctly

#### 4.2. Performance Verification

- [ ] Response times meet targets
- [ ] Memory usage meets targets
- [ ] Database performance meets targets

#### 4.3. Code Quality Verification

- [ ] Test coverage > 80%
- [ ] No critical code smells
- [ ] Documentation complete
- [ ] Code review completed

---

## ✅ Phase 4 Definition of Done

- [ ] All unit tests written và passing
- [ ] All integration tests written và passing
- [ ] All E2E tests written và passing
- [ ] Performance testing completed
- [ ] Code cleanup completed
- [ ] Documentation updated
- [ ] Final verification completed
- [ ] Ready for production deployment

---

## 📊 Overall Success Metrics

### Functionality
- ✅ All APIs work as before
- ✅ All business logic works correctly
- ✅ All events are emitted correctly

### Performance
- ✅ Response time không tăng > 10%
- ✅ Memory usage không tăng > 15%
- ✅ Database queries optimized

### Code Quality
- ✅ Gateway code giảm ~1000+ lines
- ✅ Business logic tập trung ở microservices
- ✅ Test coverage > 80%
- ✅ No critical code smells

### Architecture
- ✅ Gateway chỉ làm routing/protocol translation
- ✅ Business logic ở microservices
- ✅ Clear service boundaries
- ✅ Proper separation of concerns

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes trong API response | High | Comprehensive testing, feature flag |
| Performance degradation | Medium | Load testing, caching nếu cần |
| gRPC client issues | Medium | Error handling, retry logic |
| Event emission issues | Low | Fallback mechanism, logging |
| Cross-service communication issues | Medium | Circuit breaker, timeout handling |
| Data consistency issues | High | Transaction management, validation |

---

## 📅 Overall Timeline

| Phase | Duration | Start Week | End Week |
|-------|----------|------------|----------|
| Phase 1: Inventory | 2-3 weeks | Week 1 | Week 3 |
| Phase 2: Integration | 1-2 weeks | Week 4 | Week 5 |
| Phase 3: Machine | 1 week | Week 6 | Week 6 |
| Phase 4: Testing & Cleanup | 1 week | Week 7 | Week 7 |
| **Total** | **6-8 weeks** | **Week 1** | **Week 7-8** |

---

## 🔄 Rollback Plan

Nếu có issues sau khi deploy:

### Immediate Rollback
1. Revert Gateway changes
2. Keep microservice changes (backward compatible)
3. Restart Gateway
4. Monitor logs

### Gradual Rollback
1. Feature flag để switch giữa old/new implementation
2. Rollback từng endpoint nếu chỉ một số có issues
3. Monitor metrics

### Partial Rollback
1. Rollback từng phase nếu chỉ một phase có issues
2. Keep completed phases
3. Fix issues và retry

---

## 📝 Notes

- **Feature Flag**: Có thể implement feature flag để switch giữa old/new implementation trong quá trình migration
- **Gradual Migration**: Có thể migrate từng endpoint một thay vì tất cả cùng lúc
- **Monitoring**: Thêm monitoring/metrics để track performance và errors
- **Caching**: Cân nhắc thêm caching cho summary data nếu cần
- **Backward Compatibility**: Đảm bảo API responses backward compatible

---

## 🔗 Related Documents

- [Architecture Overview](./README.md)
- [Microservices Best Practices](./SERVICE_IMPLEMENTATION_GUIDE.md)
- [API Gateway Architecture](./docs/architecture.md) (if exists)

---

**Last Updated**: 2026-01-18
**Status**: Planning
**Owner**: Development Team
**Version**: 1.0
