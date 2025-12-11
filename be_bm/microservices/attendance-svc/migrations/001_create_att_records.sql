-- ============================================
-- Attendance Service Database Schema
-- Table: ATT_RECORDS
-- Description: Store attendance records from time attendance devices
-- ============================================

-- Drop table if exists (for clean reinstall)
-- DROP TABLE ATT_RECORDS CASCADE CONSTRAINTS;

-- Create main attendance records table
CREATE TABLE ATT_RECORDS (
    ID VARCHAR2(36) PRIMARY KEY,
    EMPLOYEE_CODE VARCHAR2(50) NOT NULL,
    DEVICE_ID VARCHAR2(100),
    EVENT_TYPE VARCHAR2(20),
    EVENT_TIMESTAMP TIMESTAMP NOT NULL,
    IMAGE_URL VARCHAR2(500),
    VERIFIED NUMBER(1) DEFAULT 0,
    RAW_DATA CLOB,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    VERSION NUMBER DEFAULT 1,
    
    CONSTRAINT CHK_ATT_VERIFIED CHECK (VERIFIED IN (0, 1))
);

-- Create indexes for better query performance
CREATE INDEX IDX_ATT_EMPLOYEE_CODE ON ATT_RECORDS(EMPLOYEE_CODE);
CREATE INDEX IDX_ATT_EVENT_TIMESTAMP ON ATT_RECORDS(EVENT_TIMESTAMP);
CREATE INDEX IDX_ATT_DEVICE_ID ON ATT_RECORDS(DEVICE_ID);
CREATE INDEX IDX_ATT_CREATED_AT ON ATT_RECORDS(CREATED_AT);

-- Create composite index for common queries
CREATE INDEX IDX_ATT_EMP_TIMESTAMP ON ATT_RECORDS(EMPLOYEE_CODE, EVENT_TIMESTAMP);

-- Add comments
COMMENT ON TABLE ATT_RECORDS IS 'Attendance records from time attendance devices';
COMMENT ON COLUMN ATT_RECORDS.ID IS 'Primary key (UUID)';
COMMENT ON COLUMN ATT_RECORDS.EMPLOYEE_CODE IS 'Employee code from attendance device';
COMMENT ON COLUMN ATT_RECORDS.DEVICE_ID IS 'Device ID or IP address';
COMMENT ON COLUMN ATT_RECORDS.EVENT_TYPE IS 'Event type: IN, OUT, BREAK_START, BREAK_END';
COMMENT ON COLUMN ATT_RECORDS.EVENT_TIMESTAMP IS 'Timestamp of attendance event';
COMMENT ON COLUMN ATT_RECORDS.IMAGE_URL IS 'URL to captured image (if available)';
COMMENT ON COLUMN ATT_RECORDS.VERIFIED IS 'Verification status: 0=unverified, 1=verified';
COMMENT ON COLUMN ATT_RECORDS.RAW_DATA IS 'Raw JSON data from device for debugging';
COMMENT ON COLUMN ATT_RECORDS.CREATED_AT IS 'Record creation timestamp';
COMMENT ON COLUMN ATT_RECORDS.UPDATED_AT IS 'Record last update timestamp';
COMMENT ON COLUMN ATT_RECORDS.VERSION IS 'Optimistic locking version';

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON ATT_RECORDS TO your_app_user;
