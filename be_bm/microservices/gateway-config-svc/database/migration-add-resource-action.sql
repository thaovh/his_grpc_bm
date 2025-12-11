-- ============================================================================
-- Migration: Add RESOURCE_NAME and ACTION columns to GW_API_ENDPOINTS table
-- Date: 2025-01-XX
-- Description: Add resource-based authorization support while keeping path-based for Kong sync
-- 
-- This migration is SAFE and BACKWARD COMPATIBLE:
-- - Adds nullable columns (existing data unaffected)
-- - Existing endpoints continue to work via path-based matching
-- - New endpoints can use resource-based matching
-- ============================================================================

-- Step 1: Check if columns already exist (for idempotency)
-- If columns exist, this script will skip adding them

DECLARE
    v_column_exists NUMBER;
BEGIN
    -- Check RESOURCE_NAME column
    SELECT COUNT(*) INTO v_column_exists
    FROM USER_TAB_COLUMNS
    WHERE TABLE_NAME = 'GW_API_ENDPOINTS' AND COLUMN_NAME = 'RESOURCE_NAME';
    
    IF v_column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GW_API_ENDPOINTS ADD (RESOURCE_NAME VARCHAR2(200))';
        DBMS_OUTPUT.PUT_LINE('Added column RESOURCE_NAME');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Column RESOURCE_NAME already exists, skipping...');
    END IF;
    
    -- Check ACTION column
    SELECT COUNT(*) INTO v_column_exists
    FROM USER_TAB_COLUMNS
    WHERE TABLE_NAME = 'GW_API_ENDPOINTS' AND COLUMN_NAME = 'ACTION';
    
    IF v_column_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GW_API_ENDPOINTS ADD (ACTION VARCHAR2(50))';
        DBMS_OUTPUT.PUT_LINE('Added column ACTION');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Column ACTION already exists, skipping...');
    END IF;
END;
/

-- Step 2: Add indexes for better query performance (if not exists)
DECLARE
    v_index_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_index_exists
    FROM USER_INDEXES
    WHERE INDEX_NAME = 'IDX_GW_ENDPOINTS_RESOURCE';
    
    IF v_index_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GW_ENDPOINTS_RESOURCE ON GW_API_ENDPOINTS(RESOURCE_NAME, ACTION, METHOD)';
        DBMS_OUTPUT.PUT_LINE('Created index IDX_GW_ENDPOINTS_RESOURCE');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Index IDX_GW_ENDPOINTS_RESOURCE already exists, skipping...');
    END IF;
END;
/

-- Step 3: Add comments
COMMENT ON COLUMN GW_API_ENDPOINTS.RESOURCE_NAME IS 'Resource name for authorization (e.g., "users", "inventory.exp-mests"). Used for resource-based permission checking. NULL means use path-based matching.';
COMMENT ON COLUMN GW_API_ENDPOINTS.ACTION IS 'Action name for authorization (e.g., "create", "read", "update", "delete", "list", "sync"). Used for resource-based permission checking. NULL means use path-based matching.';

-- Example: Update existing endpoints with resource and action
-- Note: This is a manual process. You should update endpoints based on your business logic.
-- Example mappings:
-- /api/users (GET) -> resource: 'users', action: 'list'
-- /api/users/:id (GET) -> resource: 'users', action: 'read'
-- /api/users (POST) -> resource: 'users', action: 'create'
-- /api/users/:id (PUT) -> resource: 'users', action: 'update'
-- /api/users/:id (DELETE) -> resource: 'users', action: 'delete'
-- /api/inventory/exp-mests (GET) -> resource: 'inventory.exp-mests', action: 'list'
-- /api/inventory/exp-mests/:id (GET) -> resource: 'inventory.exp-mests', action: 'read'
-- /api/inventory/exp-mests-other/:expMestId/sync (POST) -> resource: 'inventory.exp-mests-other', action: 'sync'

-- Example update statements (uncomment and modify as needed):
/*
UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'list' 
WHERE PATH = '/api/users' AND METHOD = 'GET';

UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'read' 
WHERE PATH LIKE '/api/users/:id' AND METHOD = 'GET';

UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'create' 
WHERE PATH = '/api/users' AND METHOD = 'POST';

UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'update' 
WHERE PATH LIKE '/api/users/:id' AND METHOD = 'PUT';

UPDATE GW_API_ENDPOINTS 
SET RESOURCE_NAME = 'users', ACTION = 'delete' 
WHERE PATH LIKE '/api/users/:id' AND METHOD = 'DELETE';
*/

COMMIT;
