-- Migration: Fix LAST_POLL_TIME timezone issue
-- Date: 2026-01-05
-- Description: Change LAST_POLL_TIME from TIMESTAMP to TIMESTAMP WITH TIME ZONE

-- Step 1: Add new column with timezone support
ALTER TABLE ATT_POLLING_CONFIG 
ADD LAST_POLL_TIME_TZ TIMESTAMP WITH TIME ZONE;

-- Step 2: Copy data from old column to new column
-- Convert existing timestamps to UTC+7 (Vietnam timezone)
UPDATE ATT_POLLING_CONFIG 
SET LAST_POLL_TIME_TZ = FROM_TZ(LAST_POLL_TIME, '+07:00')
WHERE LAST_POLL_TIME IS NOT NULL;

-- Step 3: Drop old column
ALTER TABLE ATT_POLLING_CONFIG 
DROP COLUMN LAST_POLL_TIME;

-- Step 4: Rename new column to original name
ALTER TABLE ATT_POLLING_CONFIG 
RENAME COLUMN LAST_POLL_TIME_TZ TO LAST_POLL_TIME;

-- Verify the change
SELECT ID, NAME, LAST_POLL_TIME 
FROM ATT_POLLING_CONFIG;
