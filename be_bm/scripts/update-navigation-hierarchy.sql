-- Script để update PARENT_ID cho các feature con
-- Chạy script này trong Oracle SQL Developer hoặc SQL*Plus

-- 1. Update các feature thuộc module "Quản lý kho" (MOD_INVENTORY)
UPDATE APP_FEATURES 
SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_INVENTORY')
WHERE CODE IN ('FEAT_EXP_MEST', 'FEAT_EXP_OTHER');

-- 2. Update các feature thuộc module "Quản lý máy" (MOD_MACHINE)
UPDATE APP_FEATURES 
SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_MACHINE')
WHERE CODE IN ('FEAT_MACHINE_LIST');

-- 3. Update các feature thuộc module "Hệ thống" (MOD_SYSTEM)
UPDATE APP_FEATURES 
SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_SYSTEM')
WHERE CODE IN ('FEAT_GW_CONFIG');

-- Commit changes
COMMIT;

-- Verify kết quả
SELECT 
    f.CODE,
    f.NAME,
    f.PARENT_ID,
    p.CODE as PARENT_CODE,
    p.NAME as PARENT_NAME
FROM APP_FEATURES f
LEFT JOIN APP_FEATURES p ON f.PARENT_ID = p.ID
ORDER BY f.ORDER_INDEX;
