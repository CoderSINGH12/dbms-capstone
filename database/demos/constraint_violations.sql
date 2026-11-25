-- ============================================================================
-- constraint_violations.sql
-- Demonstration of DBMS integrity enforcement rejecting bad data
-- ============================================================================

USE fcb_laliga_db;

-- 1. Negative Test: Team playing itself (home_team_id = away_team_id)
-- Expected error: Check constraint 'chk_diff_teams' is violated.
INSERT INTO matches (season_id, matchday, home_team_id, away_team_id, status)
VALUES (1, 38, 1, 1, 'scheduled');

-- 2. Negative Test: Negative score in match
-- Expected error: Check constraint 'chk_home_score' is violated.
INSERT INTO matches (season_id, matchday, home_team_id, away_team_id, status, home_score, away_score)
VALUES (1, 38, 1, 2, 'finished', -1, 3);

-- 3. Negative Test: Finished status without scores
-- Expected error: Check constraint 'chk_finished_scores' is violated.
INSERT INTO matches (season_id, matchday, home_team_id, away_team_id, status, home_score, away_score)
VALUES (1, 38, 1, 2, 'finished', NULL, NULL);

-- 4. Negative Test: Duplicate fixture in the same season
-- Expected error: Duplicate entry for key 'uq_season_fixture'.
INSERT INTO matches (season_id, matchday, home_team_id, away_team_id, status)
VALUES (1, 1, 9, 1, 'scheduled');

-- 5. Negative Test: Player minutes > 130
-- Expected error: Check constraint 'chk_pms_minutes' is violated.
INSERT INTO player_match_stats (match_id, registration_id, minutes)
VALUES (1, 1, 180);

-- 6. Negative Test: Red cards > 1
-- Expected error: Check constraint 'chk_pms_red' is violated.
INSERT INTO player_match_stats (match_id, registration_id, minutes, red)
VALUES (1, 1, 90, 2);

-- 7. Negative Test: Trigger rejection when player doesn't belong to either team
-- (e.g. Celta Vigo player registration_id = 26 inserted into match between Valencia and Barcelona)
-- Expected error: 'Integrity violation: Player does not belong to either the home or away team for this match.'
INSERT INTO player_match_stats (match_id, registration_id, minutes, goals)
VALUES (1, 26, 90, 1);
