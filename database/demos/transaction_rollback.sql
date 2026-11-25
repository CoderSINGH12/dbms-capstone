-- ============================================================================
-- transaction_rollback.sql
-- Demonstration of atomic multi-table transaction rollback upon integrity error
-- ============================================================================

USE fcb_laliga_db;

-- 1. Showcase ROLLBACK on failure
START TRANSACTION;

-- Step A: Attempt to record a match result
UPDATE matches 
SET home_score = 2, away_score = 1, status = 'finished'
WHERE id = 45;

-- Step B: Attempt to insert invalid player stats (violates CHECK minutes <= 130)
-- This fails due to chk_pms_minutes!
INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists)
VALUES (45, 1, 1, 999, 1, 0);

-- When an error occurs in application code, ROLLBACK is issued:
ROLLBACK;

-- Verify that Step A was safely undone:
SELECT id, home_score, away_score, status 
FROM matches 
WHERE id = 45;
-- Expected output: status remains 'scheduled', home_score remains NULL!
