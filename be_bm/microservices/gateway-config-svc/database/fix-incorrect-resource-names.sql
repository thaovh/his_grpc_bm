-- ============================================================================
-- Script: Fix incorrect RESOURCE_NAME values
-- Description: Update RESOURCE_NAME based on PATH patterns
-- This fixes endpoints that got wrong RESOURCE_NAME from the parsing bug
-- ============================================================================

SET SERVEROUTPUT ON;

BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting to fix incorrect RESOURCE_NAME values...');
    DBMS_OUTPUT.PUT_LINE('================================================');
    
    -- Fix Master Data endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.notification-types' WHERE PATH = '/api/master-data/notification-types' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.notification-types';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.export-statuses' WHERE PATH = '/api/master-data/export-statuses' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.export-statuses';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.branches' WHERE PATH = '/api/master-data/branches' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.branches';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.department-types' WHERE PATH = '/api/master-data/department-types' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.department-types';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.departments' WHERE PATH = '/api/master-data/departments' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.departments';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-funding-sources' WHERE PATH = '/api/master-data/machine-funding-sources' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.machine-funding-sources';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturers' WHERE PATH = '/api/master-data/manufacturers' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.manufacturers';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.manufacturer-countries' WHERE PATH = '/api/master-data/manufacturer-countries' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.manufacturer-countries';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-document-types' WHERE PATH = '/api/master-data/machine-document-types' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.machine-document-types';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-categories' WHERE PATH = '/api/master-data/machine-categories' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.machine-categories';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-statuses' WHERE PATH = '/api/master-data/machine-statuses' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.machine-statuses';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.machine-units' WHERE PATH = '/api/master-data/machine-units' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.machine-units';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.vendors' WHERE PATH = '/api/master-data/vendors' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.vendors';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.maintenance-types' WHERE PATH = '/api/master-data/maintenance-types' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.maintenance-types';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.transfer-statuses' WHERE PATH = '/api/master-data/transfer-statuses' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.transfer-statuses';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'master-data.transfer-types' WHERE PATH = '/api/master-data/transfer-types' AND METHOD = 'GET' AND RESOURCE_NAME != 'master-data.transfer-types';
    
    -- Fix Integration endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests' WHERE PATH = '/api/integration/exp-mests' AND METHOD = 'GET' AND RESOURCE_NAME != 'integration.exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.medi-stock' WHERE PATH = '/api/integration/medi-stock/by-room-id/:roomId' AND METHOD = 'GET' AND RESOURCE_NAME != 'integration.medi-stock';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mest-stt' WHERE PATH = '/api/integration/exp-mest-stt' AND METHOD = 'GET' AND RESOURCE_NAME != 'integration.exp-mest-stt';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mest-type' WHERE PATH = '/api/integration/exp-mest-type' AND METHOD = 'GET' AND RESOURCE_NAME != 'integration.exp-mest-type';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.work-info' WHERE PATH = '/api/integration/work-info' AND METHOD = 'POST' AND RESOURCE_NAME != 'integration.work-info';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'integration.exp-mests' WHERE PATH = '/api/integration/exp-mests/by-code' AND METHOD = 'GET' AND RESOURCE_NAME != 'integration.exp-mests';
    
    -- Fix Inventory endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests' AND METHOD = 'GET' AND RESOURCE_NAME != 'inventory.inpatient-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/inventory/exp-mests-other/:expMestId/sync' AND METHOD = 'POST' AND RESOURCE_NAME != 'inventory.exp-mests-other';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/:expMestId/sync' AND METHOD = 'POST' AND RESOURCE_NAME != 'inventory.cabinet-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests/:expMestId/summary' AND METHOD = 'GET' AND RESOURCE_NAME != 'inventory.inpatient-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/:expMestId/summary' AND METHOD = 'GET' AND RESOURCE_NAME != 'inventory.cabinet-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/exp-mests-other/:expMestId/summary' AND METHOD = 'GET' AND RESOURCE_NAME != 'inventory.exp-mests-other';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests/medicines/export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.inpatient-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.inpatient-exp-mests' WHERE PATH = '/api/inventory/inpatient-exp-mests/medicines/actual-export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.inpatient-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/inventory/exp-mests-other/medicines/export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.exp-mests-other';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.exp-mests-other' WHERE PATH = '/api/inventory/exp-mests-other/medicines/actual-export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.exp-mests-other';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/medicines/export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.cabinet-exp-mests';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'inventory.cabinet-exp-mests' WHERE PATH = '/api/inventory/cabinet-exp-mests/medicines/actual-export' AND METHOD = 'PUT' AND RESOURCE_NAME != 'inventory.cabinet-exp-mests';
    
    -- Fix Auth endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'logout' WHERE PATH = '/api/auth/logout' AND METHOD = 'POST' AND RESOURCE_NAME != 'auth';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'refresh' WHERE PATH = '/api/auth/refresh' AND METHOD = 'POST' AND RESOURCE_NAME != 'auth';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'read' WHERE PATH = '/api/auth/me' AND METHOD = 'GET' AND RESOURCE_NAME != 'auth';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'auth', ACTION = 'change-password' WHERE PATH = '/api/auth/change-password' AND METHOD = 'POST' AND RESOURCE_NAME != 'auth';
    
    -- Fix Users endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users' WHERE PATH = '/api/users' AND METHOD = 'POST' AND RESOURCE_NAME != 'users';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users', ACTION = 'read' WHERE PATH = '/api/users/:id' AND METHOD = 'GET' AND RESOURCE_NAME != 'users';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users' WHERE PATH = '/api/users/:id' AND METHOD = 'DELETE' AND RESOURCE_NAME != 'users';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'GET' AND RESOURCE_NAME != 'users.profile';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users.profile' WHERE PATH = '/api/users/:id/profile' AND METHOD = 'PUT' AND RESOURCE_NAME != 'users.profile';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'users' WHERE PATH = '/api/users/device-tokens' AND METHOD = 'POST' AND RESOURCE_NAME != 'users.device-tokens';
    
    -- Fix Roles endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'revoke' WHERE PATH = '/api/roles/revoke' AND METHOD = 'POST' AND RESOURCE_NAME != 'roles';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'roles', ACTION = 'read' WHERE PATH = '/api/roles/:id' AND METHOD = 'GET' AND RESOURCE_NAME != 'roles';
    
    -- Fix Gateway Config endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config.features' WHERE PATH = '/api/gateway-config/features' AND METHOD = 'GET' AND RESOURCE_NAME != 'gateway-config.features';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'gateway-config' WHERE PATH = '/api/gateway-config/sync-all' AND METHOD = 'POST' AND RESOURCE_NAME != 'gateway-config';
    
    -- Fix Attendance endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'read' WHERE PATH = '/api/attendance/count' AND METHOD = 'GET' AND RESOURCE_NAME != 'attendance';
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'attendance', ACTION = 'read' WHERE PATH = '/api/attendance/:id' AND METHOD = 'GET' AND RESOURCE_NAME != 'attendance';
    
    -- Fix Machine endpoints
    UPDATE GW_API_ENDPOINTS SET RESOURCE_NAME = 'machines', ACTION = 'read' WHERE PATH = '/api/machines/:id' AND METHOD = 'GET' AND RESOURCE_NAME != 'machines';
    
    DBMS_OUTPUT.PUT_LINE('Fixed incorrect RESOURCE_NAME values!');
    COMMIT;
END;
/

-- Verify fixes
SELECT 
    PATH, 
    METHOD, 
    RESOURCE_NAME, 
    ACTION,
    CASE 
        WHEN PATH LIKE '%unit-of-measures%' AND RESOURCE_NAME != 'master-data.unit-of-measures' THEN 'WRONG'
        WHEN PATH LIKE '%export-statuses%' AND RESOURCE_NAME != 'master-data.export-statuses' THEN 'WRONG'
        WHEN PATH LIKE '%branches%' AND RESOURCE_NAME != 'master-data.branches' THEN 'WRONG'
        WHEN PATH LIKE '%department-types%' AND RESOURCE_NAME != 'master-data.department-types' THEN 'WRONG'
        WHEN PATH LIKE '%departments%' AND RESOURCE_NAME != 'master-data.departments' THEN 'WRONG'
        WHEN PATH LIKE '%machine-funding-sources%' AND RESOURCE_NAME != 'master-data.machine-funding-sources' THEN 'WRONG'
        WHEN PATH LIKE '%manufacturers%' AND RESOURCE_NAME != 'master-data.manufacturers' THEN 'WRONG'
        WHEN PATH LIKE '%manufacturer-countries%' AND RESOURCE_NAME != 'master-data.manufacturer-countries' THEN 'WRONG'
        WHEN PATH LIKE '%machine-document-types%' AND RESOURCE_NAME != 'master-data.machine-document-types' THEN 'WRONG'
        WHEN PATH LIKE '%machine-categories%' AND RESOURCE_NAME != 'master-data.machine-categories' THEN 'WRONG'
        WHEN PATH LIKE '%machine-statuses%' AND RESOURCE_NAME != 'master-data.machine-statuses' THEN 'WRONG'
        WHEN PATH LIKE '%machine-units%' AND RESOURCE_NAME != 'master-data.machine-units' THEN 'WRONG'
        WHEN PATH LIKE '%vendors%' AND RESOURCE_NAME != 'master-data.vendors' THEN 'WRONG'
        WHEN PATH LIKE '%maintenance-types%' AND RESOURCE_NAME != 'master-data.maintenance-types' THEN 'WRONG'
        WHEN PATH LIKE '%transfer-statuses%' AND RESOURCE_NAME != 'master-data.transfer-statuses' THEN 'WRONG'
        WHEN PATH LIKE '%transfer-types%' AND RESOURCE_NAME != 'master-data.transfer-types' THEN 'WRONG'
        WHEN PATH LIKE '%notification-types%' AND RESOURCE_NAME != 'master-data.notification-types' THEN 'WRONG'
        ELSE 'OK'
    END AS STATUS
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
ORDER BY STATUS DESC, PATH;
