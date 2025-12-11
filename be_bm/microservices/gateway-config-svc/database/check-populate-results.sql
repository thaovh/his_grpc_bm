-- ============================================================================
-- Check Results: Verify RESOURCE_NAME and ACTION population
-- Run this to see detailed results after populate-resource-action-simple.sql
-- ============================================================================

SET SERVEROUTPUT ON;

-- Summary
PROMPT ========================================
PROMPT SUMMARY
PROMPT ========================================

SELECT 
    COUNT(*) as total_endpoints,
    COUNT(RESOURCE_NAME) as with_resource,
    COUNT(ACTION) as with_action,
    COUNT(CASE WHEN RESOURCE_NAME IS NOT NULL AND ACTION IS NOT NULL THEN 1 END) as fully_configured,
    COUNT(CASE WHEN RESOURCE_NAME IS NULL OR ACTION IS NULL THEN 1 END) as missing_data
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1;

-- By Module
PROMPT ========================================
PROMPT BY MODULE
PROMPT ========================================

SELECT 
    MODULE,
    COUNT(*) as total,
    COUNT(RESOURCE_NAME) as with_resource,
    COUNT(ACTION) as with_action,
    COUNT(CASE WHEN RESOURCE_NAME IS NOT NULL AND ACTION IS NOT NULL THEN 1 END) as fully_configured
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
GROUP BY MODULE
ORDER BY MODULE;

-- Sample endpoints with resource + action
PROMPT ========================================
PROMPT SAMPLE ENDPOINTS (First 30)
PROMPT ========================================

SELECT 
    RPAD(METHOD, 8) as METHOD,
    RPAD(SUBSTR(PATH, 1, 50), 50) as PATH,
    RPAD(NVL(RESOURCE_NAME, 'NULL'), 35) as RESOURCE_NAME,
    RPAD(NVL(ACTION, 'NULL'), 20) as ACTION,
    MODULE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
ORDER BY MODULE, PATH, METHOD
FETCH FIRST 30 ROWS ONLY;

-- Check for any missing data
PROMPT ========================================
PROMPT ENDPOINTS WITH MISSING DATA (if any)
PROMPT ========================================

SELECT 
    METHOD,
    PATH,
    RESOURCE_NAME,
    ACTION,
    MODULE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND (RESOURCE_NAME IS NULL OR ACTION IS NULL)
ORDER BY MODULE, PATH, METHOD;

-- Group by resource name
PROMPT ========================================
PROMPT RESOURCES SUMMARY
PROMPT ========================================

SELECT 
    RESOURCE_NAME,
    COUNT(*) as endpoint_count,
    LISTAGG(DISTINCT ACTION, ', ') WITHIN GROUP (ORDER BY ACTION) as actions
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND RESOURCE_NAME IS NOT NULL
GROUP BY RESOURCE_NAME
ORDER BY RESOURCE_NAME;
