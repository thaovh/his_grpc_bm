-- Script kiểm tra database attendance

-- 1. Kiểm tra bảng có tồn tại không
SELECT table_name 
FROM user_tables 
WHERE table_name = 'ATT_RECORDS';

-- 2. Kiểm tra cấu trúc bảng
DESC ATT_RECORDS;

-- 3. Đếm số records
SELECT COUNT(*) as total_records 
FROM ATT_RECORDS;

-- 4. Xem 10 records mới nhất
SELECT 
    ID,
    EMPLOYEE_CODE,
    DEVICE_ID,
    EVENT_TYPE,
    TO_CHAR(EVENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS') as EVENT_TIME,
    VERIFIED,
    TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_TIME
FROM ATT_RECORDS 
ORDER BY CREATED_AT DESC 
FETCH FIRST 10 ROWS ONLY;

-- 5. Thống kê theo employee
SELECT 
    EMPLOYEE_CODE,
    COUNT(*) as total_events,
    MIN(EVENT_TIMESTAMP) as first_event,
    MAX(EVENT_TIMESTAMP) as last_event
FROM ATT_RECORDS
GROUP BY EMPLOYEE_CODE
ORDER BY total_events DESC;

-- 6. Thống kê theo device
SELECT 
    DEVICE_ID,
    COUNT(*) as total_events
FROM ATT_RECORDS
GROUP BY DEVICE_ID
ORDER BY total_events DESC;
