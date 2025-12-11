-- ============================================================================
-- Script: Fix ALL incorrect RESOURCE_NAME values
-- Description: Update RESOURCE_NAME based on PATH patterns from actual code
-- This fixes all endpoints that got wrong RESOURCE_NAME from the parsing bug
-- ============================================================================

SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting to fix ALL incorrect RESOURCE_NAME values...');
    DBMS_OUTPUT.PUT_LINE('================================================');
    
    -- ========================================================================
    -- MASTER DATA FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.notification-types' WHERE PATH = '/api/master-data/notification-types' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses' WHERE PATH = '/api/master-data/export-statuses' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches' WHERE PATH = '/api/master-data/branches' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types' WHERE PATH = '/api/master-data/department-types' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments' WHERE PATH = '/api/master-data/departments' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources' WHERE PATH = '/api/master-data/machine-funding-sources' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers' WHERE PATH = '/api/master-data/manufacturers' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturer-countries' WHERE PATH = '/api/master-data/manufacturer-countries' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-document-types' WHERE PATH = '/api/master-data/machine-document-types' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-categories' WHERE PATH = '/api/master-data/machine-categories' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-statuses' WHERE PATH = '/api/master-data/machine-statuses' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-units' WHERE PATH = '/api/master-data/machine-units' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.vendors' WHERE PATH = '/api/master-data/vendors' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.maintenance-types' WHERE PATH = '/api/master-data/maintenance-types' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.transfer-statuses' WHERE PATH = '/api/master-data/transfer-statuses' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.transfer-types' WHERE PATH = '/api/master-data/transfer-types' AND METHOD = 'GET';
    
    -- ========================================================================
    -- INTEGRATION FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests' WHERE PATH = '/api/integration/exp-mests' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.medi-stock' WHERE PATH = '/api/integration/medi-stock/by-room-id/:roomId' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mest-stt' WHERE PATH = '/api/integration/exp-mest-stt' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mest-type' WHERE PATH = '/api/integration/exp-mest-type' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.work-info' WHERE PATH = '/api/integration/work-info' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests' WHERE PATH = '/api/integration/exp-mests/by-code' AND METHOD = 'GET';
    
    -- ========================================================================
    -- INVENTORY FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/inventory/exp-mests-other/:expMestId/sync' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/:expMestId/sync' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests/:expMestId/summary' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/:expMestId/summary' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/exp-mests-other/:expMestId/summary' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests', ACTION = 'export' WHERE PATH = '/api/inventory/inpatient-exp-mests/medicines/export' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests', ACTION = 'actual-export' WHERE PATH = '/api/inventory/inpatient-exp-mests/medicines/actual-export' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other', ACTION = 'export' WHERE PATH = '/api/inventory/exp-mests-other/medicines/export' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other', ACTION = 'actual-export' WHERE PATH = '/api/inventory/exp-mests-other/medicines/actual-export' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests', ACTION = 'export' WHERE PATH = '/api/inventory/cabinet-exp-mests/medicines/export' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests', ACTION = 'actual-export' WHERE PATH = '/api/inventory/cabinet-exp-mests/medicines/actual-export' AND METHOD = 'PUT';
    
    -- ========================================================================
    -- AUTH FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'logout' WHERE PATH = '/api/auth/logout' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'refresh' WHERE PATH = '/api/auth/refresh' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'read' WHERE PATH = '/api/auth/me' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'change-password' WHERE PATH = '/api/auth/change-password' AND METHOD = 'POST';
    
    -- ========================================================================
    -- USERS FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users' WHERE PATH = '/api/users' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/:id' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users' WHERE PATH = '/api/users/:id' AND METHOD = 'DELETE';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'PUT';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.device-tokens' WHERE PATH = '/api/users/device-tokens' AND METHOD = 'POST';
    
    -- ========================================================================
    -- ROLES FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'revoke' WHERE PATH = '/api/roles/revoke' AND METHOD = 'POST';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'read' WHERE PATH = '/api/roles/:id' AND METHOD = 'GET';
    
    -- ========================================================================
    -- GATEWAY CONFIG FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features' WHERE PATH = '/api/gateway-config/features' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config' WHERE PATH = '/api/gateway-config/sync-all' AND METHOD = 'POST';
    
    -- ========================================================================
    -- ATTENDANCE FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'read' WHERE PATH = '/api/attendance/count' AND METHOD = 'GET';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'read' WHERE PATH = '/api/attendance/:id' AND METHOD = 'GET';
    
    -- ========================================================================
    -- MACHINE FIXES
    -- ========================================================================
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'machines', ACTION = 'read' WHERE PATH = '/api/machines/:id' AND METHOD = 'GET';
    
    -- ========================================================================
    -- ADDITIONAL FIXES BASED ON ACTUAL DATA
    -- ========================================================================
    -- Fix action for inventory summary endpoints
    UPDATE GW_API_ENDPOINTS SET ACTION = 'read' WHERE PATH = '/api/inventory/inpatient-exp-mests/medicines/actual-export' AND METHOD = 'PUT' AND ACTION != 'actual-export';
    UPDATE GW_API_ENDPOINTS SET ACTION = 'read' WHERE PATH = '/api/inventory/exp-mests-other/medicines/actual-export' AND METHOD = 'PUT' AND ACTION != 'actual-export';
    UPDATE GW_API_ENDPOINTS SET ACTION = 'read' WHERE PATH = '/api/inventory/cabinet-exp-mests/medicines/actual-export' AND METHOD = 'PUT' AND ACTION != 'actual-export';
    
    -- Fix roles revoke action
    UPDATE GW_API_ENDPOINTS SET ACTION = 'revoke' WHERE PATH = '/api/roles/revoke' AND METHOD = 'POST' AND ACTION != 'revoke';
    
    DBMS_OUTPUT.PUT_LINE('Fixed all incorrect RESOURCE_NAME and ACTION values!');
    COMMIT;
END;
/

-- Verify: Show any remaining inconsistencies
SELECT 
    PATH, 
    METHOD, 
    RESOURCE_NAME, 
    ACTION
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND (
    -- Master Data inconsistencies
    (PATH LIKE '%unit-of-measures%' AND RESOURCE_NAME != 'master-data.unit-of-measures')
    OR (PATH LIKE '%export-statuses%' AND RESOURCE_NAME != 'master-data.export-statuses')
    OR (PATH LIKE '%branches%' AND RESOURCE_NAME != 'master-data.branches')
    OR (PATH LIKE '%department-types%' AND RESOURCE_NAME != 'master-data.department-types')
    OR (PATH LIKE '%departments%' AND RESOURCE_NAME != 'master-data.departments')
    OR (PATH LIKE '%machine-funding-sources%' AND RESOURCE_NAME != 'master-data.machine-funding-sources')
    OR (PATH LIKE '%manufacturers%' AND PATH NOT LIKE '%manufacturer-countries%' AND RESOURCE_NAME != 'master-data.manufacturers')
    OR (PATH LIKE '%manufacturer-countries%' AND RESOURCE_NAME != 'master-data.manufacturer-countries')
    OR (PATH LIKE '%machine-document-types%' AND RESOURCE_NAME != 'master-data.machine-document-types')
    OR (PATH LIKE '%machine-categories%' AND RESOURCE_NAME != 'master-data.machine-categories')
    OR (PATH LIKE '%machine-statuses%' AND RESOURCE_NAME != 'master-data.machine-statuses')
    OR (PATH LIKE '%machine-units%' AND RESOURCE_NAME != 'master-data.machine-units')
    OR (PATH LIKE '%vendors%' AND RESOURCE_NAME != 'master-data.vendors')
    OR (PATH LIKE '%maintenance-types%' AND RESOURCE_NAME != 'master-data.maintenance-types')
    OR (PATH LIKE '%transfer-statuses%' AND RESOURCE_NAME != 'master-data.transfer-statuses')
    OR (PATH LIKE '%transfer-types%' AND RESOURCE_NAME != 'master-data.transfer-types')
    OR (PATH LIKE '%notification-types%' AND RESOURCE_NAME != 'master-data.notification-types')
  )
ORDER BY PATH;
