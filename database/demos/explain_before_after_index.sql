-- ============================================================================
-- explain_before_after_index.sql
-- EXPLAIN query plan comparisons to demonstrate index performance optimization
-- ============================================================================

USE fcb_laliga_db;

-- 1. Query: Matches lookup by season and home team
-- Using index: idx_matches_season_home
EXPLAIN FORMAT=TREE 
SELECT * FROM matches 
WHERE season_id = 1 AND home_team_id = 1;

-- 2. Query: Head-to-Head El Clásico fixtures
-- Using index: idx_matches_h2h
EXPLAIN FORMAT=TREE 
SELECT * FROM matches 
WHERE home_team_id = 1 AND away_team_id = 2;

-- 3. Query: Player autocomplete / search by prefix
-- Using index: idx_players_name
EXPLAIN FORMAT=TREE 
SELECT * FROM players 
WHERE name LIKE 'Lamine%';

-- 4. Query: Aggregating stats for a specific player registration
-- Using index: idx_pms_registration
EXPLAIN FORMAT=TREE 
SELECT registration_id, SUM(minutes), SUM(goals), SUM(assists) 
FROM player_match_stats 
WHERE registration_id = 1 
GROUP BY registration_id;
