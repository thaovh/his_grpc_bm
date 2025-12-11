# Service Template - Quick Reference

File này chứa các template code để copy-paste nhanh khi tạo service mới.

## 🔄 Replace These Placeholders

- `{service-name}` → service name (e.g., `products`)
- `{EntityName}` → PascalCase (e.g., `Product`)
- `{entity}` → camelCase (e.g., `product`)
- `{entities}` → plural (e.g., `products`)
- `{ENTITY_NAME}` → UPPER_SNAKE_CASE (e.g., `PRODUCTS`)

## 📁 File Checklist

### Proto File
- [ ] `_proto/{service-name}.proto`

### Microservice
- [ ] `microservices/{service-name}-svc/src/{service-name}/entities/{entity}.entity.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/dto/create-{entity}.dto.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/dto/update-{entity}.dto.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/repositories/{service-name}.repository.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/commands/create-{entity}.command.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/commands/handlers/create-{entity}.handler.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/queries/get-{entity}s.query.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/queries/handlers/get-{entity}s.handler.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/queries/count-{entity}s.query.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/queries/handlers/count-{entity}s.handler.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/services/{service-name}.service.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/{service-name}.interface.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/controllers/{service-name}.controller.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/{service-name}.module.ts`
- [ ] `microservices/{service-name}-svc/src/{service-name}/{service-name}.seeder.ts`
- [ ] `microservices/{service-name}-svc/src/database/database.providers.ts` (update)
- [ ] `microservices/{service-name}-svc/src/app.module.ts` (update)
- [ ] `microservices/{service-name}-svc/src/main.ts` (update)
- [ ] `microservices/{service-name}-svc/package.json` (copy & update)

### API Gateway
- [ ] `api-gateway/src/_proto/{service-name}.proto` (copy)
- [ ] `api-gateway/src/{service-name}/{service-name}-svc.options.ts`
- [ ] `api-gateway/src/{service-name}/{service-name}.interface.ts`
- [ ] `api-gateway/src/{service-name}/dto/create-{entity}.dto.ts`
- [ ] `api-gateway/src/{service-name}/dto/{entity}-response.dto.ts`
- [ ] `api-gateway/src/{service-name}/{service-name}.controller.ts`
- [ ] `api-gateway/src/{service-name}/{service-name}.module.ts`
- [ ] `api-gateway/src/app.module.ts` (update)
- [ ] `api-gateway/src/config/grpc.config.ts` (update)

### Docker & Config
- [ ] `docker-compose.yaml` (add service & database)
- [ ] Environment variables (add to docker-compose)

## 🚀 Quick Start Commands

```bash
# 1. Create folder structure
cd microservices
mkdir -p {service-name}-svc/src/{service-name}/{commands/handlers,queries/handlers,controllers,services,repositories,entities,dto}

# 2. Copy proto files
cp _proto/{service-name}.proto microservices/{service-name}-svc/src/_proto/
cp _proto/commons.proto microservices/{service-name}-svc/src/_proto/
cp _proto/{service-name}.proto api-gateway/src/_proto/

# 3. Copy package.json template
cp microservices/organizations-svc/package.json microservices/{service-name}-svc/package.json
# Then update name and description

# 4. Install dependencies
cd microservices/{service-name}-svc && npm install
cd ../../api-gateway && npm install

# 5. Build
cd microservices/{service-name}-svc && npm run build
cd ../../api-gateway && npm run build
```

## 📋 Environment Variables Checklist

Add to `docker-compose.yaml`:

```yaml
{service-name}-svc:
  environment:
    NODE_ENV: "test"
    URL: "0.0.0.0"
    PORT: "50051"
    DB_NAME: "postgres"
    DB_HOST: "{service-name}-db"
    DB_PORT: "5432"
    DB_USER: "postgres"
    DB_PASSWORD: "postgres"

api-gateway:
  environment:
    {ENTITY_NAME}_SVC_URL: "{service-name}-svc"
    {ENTITY_NAME}_SVC_PORT: "50051"
```

## 🧪 Test Checklist

- [ ] Microservice starts without errors
- [ ] API Gateway connects to microservice
- [ ] GET `/api/{service-name}` returns list
- [ ] GET `/api/{service-name}/:id` returns single item
- [ ] POST `/api/{service-name}` creates new item
- [ ] Swagger UI shows new endpoints
- [ ] Logs show proper context
- [ ] Database tables created
- [ ] Seeder runs (if implemented)

## 📝 Common Issues & Solutions

### Issue: gRPC connection failed
**Solution:** Check service name in proto package and client options match

### Issue: Entity not found in database
**Solution:** Ensure entity is added to `database.providers.ts` and `db.addModels()`

### Issue: Handler not found
**Solution:** Ensure handler is registered in module's providers array

### Issue: Route conflict
**Solution:** Check route order in controller (specific routes before dynamic routes)

### Issue: Validation errors
**Solution:** Ensure DTOs have proper decorators and ValidationPipe is enabled

## 🔗 Related Files

- `SERVICE_IMPLEMENTATION_GUIDE.md` - Detailed step-by-step guide
- `USAGE_GUIDE.md` - API usage examples
- `IMPLEMENTATION_PROGRESS.md` - Architecture details
- `organizations-svc/` - Reference implementation

