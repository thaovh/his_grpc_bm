-- ============================================================================
-- Rollback Migration: Remove RESOURCE_NAME and ACTION columns from GW_API_ENDPOINTS
-- Date: 2025-01-XX
-- Description: Rollback script to remove resource-based authorization columns
-- 
-- WARNING: This will remove resource-based authorization support.
-- Only run this if you need to rollback the migration.
-- ============================================================================

-- Step 1: Drop index first
DECLARE
    v_index_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_index_exists
    FROM USER_INDEXES
    WHERE INDEX_NAME = 'IDX_GW_ENDPOINTS_RESOURCE';
    
    IF v_index_exists > 0 THEN
        EXECUTE IMMEDIATE 'DROP INDEX IDX_GW_ENDPOINTS_RESOURCE';
        DBMS_OUTPUT.PUT_LINE('Dropped index IDX_GW_ENDPOINTS_RESOURCE');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Index IDX_GW_ENDPOINTS_RESOURCE does not exist, skipping...');
    END IF;
END;
/

-- Step 2: Drop columns
DECLARE
    v_column_exists NUMBER;
BEGIN
    -- Drop ACTION column first (due to foreign key dependencies if any)
    SELECT COUNT(*) INTO v_column_exists
    FROM USER_TAB_COLUMNS
    WHERE TABLE_NAME = 'GW_API_ENDPOINTS' AND COLUMN_NAME = 'ACTION';
    
    IF v_column_exists > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GW_API_ENDPOINTS DROP COLUMN ACTION';
        DBMS_OUTPUT.PUT_LINE('Dropped column ACTION');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Column ACTION does not exist, skipping...');
    END IF;
    
    -- Drop RESOURCE_NAME column
    SELECT COUNT(*) INTO v_column_exists
    FROM USER_TAB_COLUMNS
    WHERE TABLE_NAME = 'GW_API_ENDPOINTS' AND COLUMN_NAME = 'RESOURCE_NAME';
    
    IF v_column_exists > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GW_API_ENDPOINTS DROP COLUMN RESOURCE_NAME';
        DBMS_OUTPUT.PUT_LINE('Dropped column RESOURCE_NAME');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Column RESOURCE_NAME does not exist, skipping...');
    END IF;
END;
/

COMMIT;

DBMS_OUTPUT.PUT_LINE('Rollback completed successfully!');
