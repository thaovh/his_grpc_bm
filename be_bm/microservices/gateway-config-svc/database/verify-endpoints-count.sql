-- ============================================================================
-- Script: Verify endpoints count after sync
-- Description: Check total number of endpoints and how many have RESOURCE_NAME
-- ============================================================================

SET SERVEROUTPUT ON;

SELECT 
    COUNT(*) AS TOTAL_ENDPOINTS,
    COUNT(RESOURCE_NAME) AS ENDPOINTS_WITH_RESOURCE,
    COUNT(ACTION) AS ENDPOINTS_WITH_ACTION,
    COUNT(CASE WHEN RESOURCE_NAME IS NOT NULL AND ACTION IS NOT NULL THEN 1 END) AS ENDPOINTS_WITH_BOTH
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1;

-- Show breakdown by module
SELECT 
    MODULE,
    COUNT(*) AS COUNT,
    COUNT(RESOURCE_NAME) AS WITH_RESOURCE,
    COUNT(ACTION) AS WITH_ACTION
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
GROUP BY MODULE
ORDER BY COUNT(*) DESC;

-- Show endpoints without RESOURCE_NAME (if any)
SELECT 
    PATH,
    METHOD,
    MODULE,
    DESCRIPTION
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1 
  AND RESOURCE_NAME IS NULL
ORDER BY MODULE, PATH;
