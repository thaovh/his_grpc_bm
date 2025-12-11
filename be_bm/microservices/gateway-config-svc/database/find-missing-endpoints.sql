-- ============================================================================
-- Script: Find endpoints in DB that are not discovered by script
-- Description: Compare DB endpoints (188) vs discovered endpoints (174)
-- ============================================================================

-- List all endpoints in DB with their RESOURCE_NAME status
SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    MODULE,
    IS_ACTIVE,
    CASE 
        WHEN RESOURCE_NAME IS NULL OR RESOURCE_NAME = '' THEN 'MISSING RESOURCE'
        ELSE 'HAS RESOURCE'
    END AS STATUS
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
ORDER BY 
    CASE 
        WHEN RESOURCE_NAME IS NULL OR RESOURCE_NAME = '' THEN 0
        ELSE 1
    END,
    MODULE, PATH, METHOD;

-- Count endpoints without RESOURCE_NAME
SELECT 
    COUNT(*) AS TOTAL_WITHOUT_RESOURCE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND (RESOURCE_NAME IS NULL OR RESOURCE_NAME = '');

-- List endpoints without RESOURCE_NAME (these are likely not in code or missing @Resource())
SELECT 
    PATH,
    METHOD,
    MODULE,
    DESCRIPTION
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
  AND (RESOURCE_NAME IS NULL OR RESOURCE_NAME = '')
ORDER BY MODULE, PATH, METHOD;

-- Summary by module
SELECT 
    MODULE,
    COUNT(*) AS TOTAL,
    COUNT(RESOURCE_NAME) AS WITH_RESOURCE,
    COUNT(*) - COUNT(RESOURCE_NAME) AS WITHOUT_RESOURCE
FROM GW_API_ENDPOINTS
WHERE IS_ACTIVE = 1
GROUP BY MODULE
ORDER BY COUNT(*) DESC;
