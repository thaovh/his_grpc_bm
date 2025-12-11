-- Fix ACTION for auth endpoints
-- These endpoints should have custom actions, not 'create'

UPDATE GW_API_ENDPOINTS 
SET ACTION = 'login'
WHERE PATH = '/api/auth/login' 
  AND METHOD = 'POST'
  AND (ACTION IS NULL OR ACTION != 'login');

UPDATE GW_API_ENDPOINTS 
SET ACTION = 'logout'
WHERE PATH = '/api/auth/logout' 
  AND METHOD = 'POST'
  AND (ACTION IS NULL OR ACTION != 'logout');

UPDATE GW_API_ENDPOINTS 
SET ACTION = 'refresh'
WHERE PATH = '/api/auth/refresh' 
  AND METHOD = 'POST'
  AND (ACTION IS NULL OR ACTION != 'refresh');

-- Verify
SELECT PATH, METHOD, RESOURCE_NAME, ACTION, IS_PUBLIC
FROM GW_API_ENDPOINTS
WHERE PATH LIKE '/api/auth/%'
ORDER BY PATH, METHOD;
