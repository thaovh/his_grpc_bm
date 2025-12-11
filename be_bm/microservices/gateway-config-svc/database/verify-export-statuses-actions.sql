-- Verify export-statuses endpoints have correct ACTION
-- These should have standard CRUD actions (list, create, read, update, delete), not 'export'

SELECT PATH, METHOD, RESOURCE_NAME, ACTION, IS_PUBLIC
FROM GW_API_ENDPOINTS
WHERE PATH LIKE '%/export-statuses%'
ORDER BY PATH, METHOD;

-- Expected results:
-- GET /api/master-data/export-statuses -> ACTION = 'list'
-- POST /api/master-data/export-statuses -> ACTION = 'create'
-- GET /api/master-data/export-statuses/:id -> ACTION = 'read'
-- PUT /api/master-data/export-statuses/:id -> ACTION = 'update'
-- DELETE /api/master-data/export-statuses/:id -> ACTION = 'delete'
