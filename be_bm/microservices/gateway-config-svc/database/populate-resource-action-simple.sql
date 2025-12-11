-- ============================================================================
-- Script: Populate RESOURCE_NAME and ACTION for existing endpoints (Simple Version)
-- Description: Update endpoints based on PATH + METHOD patterns
-- ============================================================================

SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting to populate RESOURCE_NAME and ACTION...');
    DBMS_OUTPUT.PUT_LINE('================================================');
    
    -- ========================================================================
    -- AUTH MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'login' WHERE PATH = '/api/auth/login' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'logout' WHERE PATH = '/api/auth/logout' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'refresh' WHERE PATH = '/api/auth/refresh' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'read' WHERE PATH = '/api/auth/me' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'change-password' WHERE PATH = '/api/auth/change-password' AND METHOD = 'POST';
    
    -- ========================================================================
    -- USERS MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'list' WHERE PATH = '/api/users' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'create' WHERE PATH = '/api/users' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/:id' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'update' WHERE PATH = '/api/users/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'delete' WHERE PATH = '/api/users/:id' AND METHOD = 'DELETE';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/username/:username' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/email/:email' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/acs-id/:acsId' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile', ACTION = 'read' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile', ACTION = 'update' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.device-tokens', ACTION = 'create' WHERE PATH = '/api/users/device-tokens' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.device-tokens', ACTION = 'delete' WHERE PATH = '/api/users/device-tokens/:token' AND METHOD = 'DELETE';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.device-tokens', ACTION = 'list' WHERE PATH = '/api/users/device-tokens' AND METHOD = 'GET';
    
    -- ========================================================================
    -- ROLES MODULE (under Users)
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'list' WHERE PATH = '/api/roles' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'create' WHERE PATH = '/api/roles' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'read' WHERE PATH = '/api/roles/:id' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'update' WHERE PATH = '/api/roles/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'delete' WHERE PATH = '/api/roles/:id' AND METHOD = 'DELETE';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'read' WHERE PATH = '/api/roles/code/:code' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'assign' WHERE PATH = '/api/roles/assign' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'revoke' WHERE PATH = '/api/roles/revoke' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'read' WHERE PATH = '/api/roles/user/:userId' AND METHOD = 'GET';
    
    -- ========================================================================
    -- MASTER DATA MODULE
    -- ========================================================================
    -- Unit of Measures
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.unit-of-measures', ACTION = 'list' WHERE PATH = '/api/master-data/unit-of-measures' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.unit-of-measures', ACTION = 'create' WHERE PATH = '/api/master-data/unit-of-measures' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.unit-of-measures', ACTION = 'update' WHERE PATH = '/api/master-data/unit-of-measures/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.unit-of-measures', ACTION = 'delete' WHERE PATH = '/api/master-data/unit-of-measures/:id' AND METHOD = 'DELETE';
    
    -- Export Statuses
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses', ACTION = 'list' WHERE PATH = '/api/master-data/export-statuses' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses', ACTION = 'create' WHERE PATH = '/api/master-data/export-statuses' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses', ACTION = 'update' WHERE PATH = '/api/master-data/export-statuses/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses', ACTION = 'delete' WHERE PATH = '/api/master-data/export-statuses/:id' AND METHOD = 'DELETE';
    
    -- Branches
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches', ACTION = 'list' WHERE PATH = '/api/master-data/branches' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches', ACTION = 'create' WHERE PATH = '/api/master-data/branches' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches', ACTION = 'update' WHERE PATH = '/api/master-data/branches/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches', ACTION = 'delete' WHERE PATH = '/api/master-data/branches/:id' AND METHOD = 'DELETE';
    
    -- Department Types
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types', ACTION = 'list' WHERE PATH = '/api/master-data/department-types' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types', ACTION = 'create' WHERE PATH = '/api/master-data/department-types' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types', ACTION = 'update' WHERE PATH = '/api/master-data/department-types/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types', ACTION = 'delete' WHERE PATH = '/api/master-data/department-types/:id' AND METHOD = 'DELETE';
    
    -- Departments
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments', ACTION = 'list' WHERE PATH = '/api/master-data/departments' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments', ACTION = 'create' WHERE PATH = '/api/master-data/departments' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments', ACTION = 'update' WHERE PATH = '/api/master-data/departments/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments', ACTION = 'delete' WHERE PATH = '/api/master-data/departments/:id' AND METHOD = 'DELETE';
    
    -- Machine Funding Sources
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources', ACTION = 'list' WHERE PATH = '/api/master-data/machine-funding-sources' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources', ACTION = 'create' WHERE PATH = '/api/master-data/machine-funding-sources' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources', ACTION = 'update' WHERE PATH = '/api/master-data/machine-funding-sources/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources', ACTION = 'delete' WHERE PATH = '/api/master-data/machine-funding-sources/:id' AND METHOD = 'DELETE';
    
    -- Manufacturers
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers', ACTION = 'list' WHERE PATH = '/api/master-data/manufacturers' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers', ACTION = 'create' WHERE PATH = '/api/master-data/manufacturers' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers', ACTION = 'update' WHERE PATH = '/api/master-data/manufacturers/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers', ACTION = 'delete' WHERE PATH = '/api/master-data/manufacturers/:id' AND METHOD = 'DELETE';
    
    -- ========================================================================
    -- INTEGRATION MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.user-rooms', ACTION = 'list' WHERE PATH = '/api/integration/user-rooms' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests', ACTION = 'list' WHERE PATH = '/api/integration/exp-mests' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests', ACTION = 'list' WHERE PATH = '/api/integration/exp-mests/inpatient' AND METHOD = 'GET';
    
    -- ========================================================================
    -- INVENTORY MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests', ACTION = 'list' WHERE PATH = '/api/inventory/exp-mests' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests', ACTION = 'sync' WHERE PATH = '/api/inventory/inpatient-exp-mests/:expMestId/sync' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other', ACTION = 'sync' WHERE PATH = '/api/inventory/exp-mests-other/:expMestId/sync' AND METHOD = 'POST';
    
    -- ========================================================================
    -- ATTENDANCE MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'list' WHERE PATH = '/api/attendance' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'read' WHERE PATH = '/api/attendance/me' AND METHOD = 'GET';
    
    -- ========================================================================
    -- MACHINE MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'machines', ACTION = 'list' WHERE PATH = '/api/machines' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'machines', ACTION = 'create' WHERE PATH = '/api/machines' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'machines', ACTION = 'update' WHERE PATH = '/api/machines/:id' AND METHOD = 'PATCH';
    
    -- ========================================================================
    -- EVENTS MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'events', ACTION = 'read' WHERE PATH = '/api/events/stream' AND METHOD = 'GET';
    
    -- ========================================================================
    -- UPLOAD MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'upload', ACTION = 'create' WHERE PATH = '/api/upload/image' AND METHOD = 'POST';
    
    -- ========================================================================
    -- APP MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'app.navigation', ACTION = 'read' WHERE PATH = '/api/app/navigation' AND METHOD = 'GET';
    
    -- ========================================================================
    -- GATEWAY CONFIG MODULE
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features', ACTION = 'list' WHERE PATH = '/api/gateway-config/features' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features', ACTION = 'create' WHERE PATH = '/api/gateway-config/features' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features', ACTION = 'update' WHERE PATH = '/api/gateway-config/features/:id' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features', ACTION = 'delete' WHERE PATH = '/api/gateway-config/features/:id' AND METHOD = 'DELETE';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.endpoints', ACTION = 'list' WHERE PATH = '/api/gateway-config/endpoints' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.endpoints', ACTION = 'create' WHERE PATH = '/api/gateway-config/endpoints' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config', ACTION = 'sync-all' WHERE PATH = '/api/gateway-config/sync-all' AND METHOD = 'POST';
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('================================================');
    DBMS_OUTPUT.PUT_LINE('Completed! All endpoints updated.');
    DBMS_OUTPUT.PUT_LINE('================================================');
END;
/

-- Verify results
PROMPT ========================================
PROMPT Verification: Summary
PROMPT ========================================

SELECT 
    COUNT(*) as total_endpoints,
    COUNT(RESOURCE_NAME) as with_resource,
    COUNT(ACTION) as with_action,
    COUNT(CASE WHEN RESOURCE_NAME IS NOT NULL AND ACTION IS NOT NULL THEN 1 END) as fully_configured
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1;

PROMPT ========================================
PROMPT Verification: By Module
PROMPT ========================================

SELECT 
    MODULE,
    COUNT(*) as total,
    COUNT(RESOURCE_NAME) as with_resource,
    COUNT(ACTION) as with_action
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
GROUP BY MODULE
ORDER BY MODULE;

PROMPT ========================================
PROMPT Verification: Sample endpoints (first 20)
PROMPT ========================================

SELECT 
    METHOD,
    PATH,
    RESOURCE_NAME,
    ACTION,
    MODULE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND RESOURCE_NAME IS NOT NULL
ORDER BY MODULE, PATH, METHOD
FETCH FIRST 20 ROWS ONLY;
