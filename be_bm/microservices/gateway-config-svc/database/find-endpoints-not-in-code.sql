-- ============================================================================
-- Script: Find endpoints in DB that are not discovered by script
-- Description: Compare DB endpoints with discovered endpoints from code
-- ============================================================================

-- List all endpoints in DB
SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    MODULE,
    DESCRIPTION
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
ORDER BY MODULE, PATH, METHOD;

-- Count by module
SELECT 
    MODULE,
    COUNT(*) AS COUNT
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
GROUP BY MODULE
ORDER BY COUNT(*) DESC;

-- Find endpoints that might be missing @Resource() decorator
-- (endpoints without RESOURCE_NAME or with NULL RESOURCE_NAME)
SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    MODULE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND (RESOURCE_NAME IS NULL OR RESOURCE_NAME = '')
ORDER BY MODULE, PATH;
