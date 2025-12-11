-- Check auth endpoints in DB
SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    IS_PUBLIC,
    IS_ACTIVE
FROM GW_API_ENDPOINTS
WHERE PATH LIKE '/api/auth/%'
ORDER BY PATH, METHOD;

-- Check if endpoints exist with resource-based lookup
SELECT 
    PATH,
    METHOD,
    RESOURCE_NAME,
    ACTION,
    IS_PUBLIC
FROM GW_API_ENDPOINTS
WHERE RESOURCE_NAME = 'auth'
  AND METHOD = 'POST'
ORDER BY ACTION;
