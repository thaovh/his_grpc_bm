-- ============================================================================
-- Script: Populate RESOURCE_NAME and ACTION for existing endpoints
-- Description: Auto-infer resource and action from PATH + METHOD
-- 
-- This script will update all endpoints with inferred resource and action
-- based on the same logic as the guard's inferActionFromMethodAndPath()
-- ============================================================================

SET SERVEROUTPUT ON;

DECLARE
    v_updated_count NUMBER := 0;
    v_resource_name VARCHAR2(200);
    v_action VARCHAR2(50);
    v_path VARCHAR2(500);
    v_method VARCHAR2(10);
BEGIN
    DBMS_OUTPUT.PUT_LINE('Starting to populate RESOURCE_NAME and ACTION...');
    DBMS_OUTPUT.PUT_LINE('================================================');
    
    -- Loop through all active endpoints
    FOR rec IN (
        SELECT ID, PATH, METHOD, MODULE
        FROM GW_API_ENDPOINTS
        WHERE IS_ACTIVE = 1
        ORDER BY MODULE, PATH, METHOD
    ) LOOP
        v_path := rec.PATH;
        v_method := rec.METHOD;
        v_resource_name := NULL;
        v_action := NULL;
        
        -- Infer resource name from path
        -- Remove /api prefix
        v_path := REPLACE(v_path, '/api/', '');
        
        -- Extract resource name (first segment or first two segments)
        IF v_path LIKE 'auth/%' THEN
            -- Auth endpoints: special handling
            IF v_path LIKE 'auth/login' THEN
                v_resource_name := 'auth';
                v_action := 'login';
            ELSIF v_path LIKE 'auth/logout' THEN
                v_resource_name := 'auth';
                v_action := 'logout';
            ELSIF v_path LIKE 'auth/refresh' THEN
                v_resource_name := 'auth';
                v_action := 'refresh';
            ELSIF v_path LIKE 'auth/me' THEN
                v_resource_name := 'auth';
                v_action := 'read';
            ELSIF v_path LIKE 'auth/change-password' THEN
                v_resource_name := 'auth';
                v_action := 'change-password';
            END IF;
        ELSIF v_path LIKE 'users/%' THEN
            -- Users endpoints
            IF v_path LIKE 'users/device-tokens%' THEN
                v_resource_name := 'users.device-tokens';
            ELSIF v_path LIKE 'users/%/profile' OR v_path LIKE 'users/:id/profile' THEN
                v_resource_name := 'users.profile';
            ELSE
                v_resource_name := 'users';
            END IF;
        ELSIF v_path LIKE 'roles/%' THEN
            -- Roles endpoints
            IF v_path LIKE 'roles/assign' THEN
                v_resource_name := 'roles';
                v_action := 'assign';
            ELSIF v_path LIKE 'roles/revoke' THEN
                v_resource_name := 'roles';
                v_action := 'revoke';
            ELSE
                v_resource_name := 'roles';
            END IF;
        ELSIF v_path LIKE 'master-data/%' THEN
            -- Master data endpoints: extract resource from path
            -- Pattern: /api/master-data/{resource}
            DECLARE
                v_segments VARCHAR2(500);
                v_resource VARCHAR2(200);
            BEGIN
                v_segments := SUBSTR(v_path, 14); -- Remove 'master-data/'
                -- Get first segment (resource name)
                v_resource := SUBSTR(v_segments, 1, INSTR(v_segments || '/', '/') - 1);
                v_resource_name := 'master-data.' || v_resource;
            END;
        ELSIF v_path LIKE 'inventory/%' THEN
            -- Inventory endpoints
            IF v_path LIKE 'inventory/exp-mests-other%' THEN
                v_resource_name := 'inventory.exp-mests-other';
            ELSIF v_path LIKE 'inventory/inpatient-exp-mests%' THEN
                v_resource_name := 'inventory.inpatient-exp-mests';
            ELSIF v_path LIKE 'inventory/exp-mests%' THEN
                v_resource_name := 'inventory.exp-mests';
            ELSE
                v_resource_name := 'inventory';
            END IF;
        ELSIF v_path LIKE 'integration/%' THEN
            v_resource_name := 'integration';
        ELSIF v_path LIKE 'attendance/%' THEN
            v_resource_name := 'attendance';
        ELSIF v_path LIKE 'machines%' THEN
            v_resource_name := 'machines';
        ELSIF v_path LIKE 'events/%' THEN
            v_resource_name := 'events';
        ELSIF v_path LIKE 'upload/%' THEN
            v_resource_name := 'upload';
        ELSIF v_path LIKE 'app/%' THEN
            v_resource_name := 'app';
        ELSIF v_path LIKE 'gateway-config/%' THEN
            v_resource_name := 'gateway-config';
        END IF;
        
        -- Infer action from method + path (if not already set)
        IF v_action IS NULL THEN
            -- Check for custom actions in path
            IF v_path LIKE '%/sync' OR v_path LIKE '%/sync/%' THEN
                v_action := 'sync';
            ELSIF v_path LIKE '%/export' OR v_path LIKE '%/export/%' THEN
                v_action := 'export';
            ELSIF v_path LIKE '%/actual-export' OR v_path LIKE '%/actual-export/%' THEN
                v_action := 'actual-export';
            ELSIF v_path LIKE '%/summary' OR v_path LIKE '%/summary/%' THEN
                v_action := 'read';
            ELSIF v_path LIKE '%/import' OR v_path LIKE '%/import/%' THEN
                v_action := 'import';
            ELSE
                -- Standard CRUD mapping
                CASE v_method
                    WHEN 'GET' THEN
                        -- Check if path has ID parameter (read) or not (list)
                        IF v_path LIKE '%/:id' OR v_path LIKE '%/:%' OR 
                           v_path LIKE '%/code/%' OR v_path LIKE '%/username/%' OR 
                           v_path LIKE '%/email/%' OR v_path LIKE '%/acs-id/%' OR
                           v_path LIKE '%/user/%' OR v_path LIKE '%/me' THEN
                            v_action := 'read';
                        ELSE
                            v_action := 'list';
                        END IF;
                    WHEN 'POST' THEN
                        v_action := 'create';
                    WHEN 'PUT' THEN
                        v_action := 'update';
                    WHEN 'PATCH' THEN
                        v_action := 'update';
                    WHEN 'DELETE' THEN
                        v_action := 'delete';
                    ELSE
                        v_action := 'read'; -- Fallback
                END CASE;
            END IF;
        END IF;
        
        -- Update endpoint if resource and action are determined
        IF v_resource_name IS NOT NULL AND v_action IS NOT NULL THEN
            UPDATE GW_API_ENDPOINTS
            SET RESOURCE_NAME = v_resource_name,
                ACTION = v_action,
                UPDATED_AT = CURRENT_TIMESTAMP
            WHERE ID = rec.ID;
            
            v_updated_count := v_updated_count + 1;
            
            DBMS_OUTPUT.PUT_LINE(
                RPAD(v_method, 8) || ' ' || 
                RPAD(SUBSTR(v_path, 1, 50), 50) || ' -> ' ||
                RPAD(v_resource_name, 30) || ' ' || v_action
            );
        ELSE
            DBMS_OUTPUT.PUT_LINE(
                'SKIPPED: ' || RPAD(v_method, 8) || ' ' || 
                SUBSTR(v_path, 1, 50) || ' (could not infer resource/action)'
            );
        END IF;
    END LOOP;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('================================================');
    DBMS_OUTPUT.PUT_LINE('Completed! Updated ' || v_updated_count || ' endpoints.');
    DBMS_OUTPUT.PUT_LINE('================================================');
END;
/

-- Verify results
PROMPT ========================================
PROMPT Verification: Summary by module
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

PROMPT ========================================
PROMPT Verification: Sample endpoints
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
