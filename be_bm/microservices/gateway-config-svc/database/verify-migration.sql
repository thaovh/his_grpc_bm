-- ============================================================================
-- Verification Script: Verify RESOURCE_NAME and ACTION columns migration
-- Run this after migration-add-resource-action.sql to verify everything is OK
-- ============================================================================

SET SERVEROUTPUT ON;

-- Step 1: Verify columns exist
PROMPT ========================================
PROMPT Step 1: Checking columns...
PROMPT ========================================

SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    DATA_LENGTH,
    NULLABLE,
    DATA_DEFAULT
FROM USER_TAB_COLUMNS
WHERE TABLE_NAME = 'GW_API_ENDPOINTS'
  AND COLUMN_NAME IN ('RESOURCE_NAME', 'ACTION')
ORDER BY COLUMN_NAME;

-- Step 2: Verify index exists
PROMPT ========================================
PROMPT Step 2: Checking index...
PROMPT ========================================

SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    COLUMN_POSITION
FROM USER_IND_COLUMNS
WHERE TABLE_NAME = 'GW_API_ENDPOINTS'
  AND INDEX_NAME = 'IDX_GW_ENDPOINTS_RESOURCE'
ORDER BY COLUMN_POSITION;

-- Step 3: Check current data status
PROMPT ========================================
PROMPT Step 3: Current endpoints status...
PROMPT ========================================

SELECT 
    COUNT(*) as total_endpoints,
    COUNT(RESOURCE_NAME) as endpoints_with_resource,
    COUNT(ACTION) as endpoints_with_action,
    COUNT(CASE WHEN RESOURCE_NAME IS NOT NULL AND ACTION IS NOT NULL THEN 1 END) as endpoints_fully_configured
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1;

-- Step 4: Sample endpoints (first 10)
PROMPT ========================================
PROMPT Step 4: Sample endpoints (first 10)...
PROMPT ========================================

SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    IS_PUBLIC,
    MODULE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
ORDER BY MODULE, PATH, METHOD
FETCH FIRST 10 ROWS ONLY;

-- Step 5: Summary by module
PROMPT ========================================
PROMPT Step 5: Summary by module...
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
PROMPT Verification completed!
PROMPT ========================================
PROMPT 
PROMPT Expected results:
PROMPT - Columns RESOURCE_NAME and ACTION should exist
PROMPT - Index IDX_GW_ENDPOINTS_RESOURCE should exist
PROMPT - All existing endpoints should have NULL for RESOURCE_NAME and ACTION
PROMPT - This is NORMAL and EXPECTED - you can populate them later
PROMPT ========================================
