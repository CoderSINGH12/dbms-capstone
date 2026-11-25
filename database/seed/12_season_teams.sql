-- ============================================================================
-- 12_season_teams.sql
-- Associate clubs with each active and historical season
-- ============================================================================

USE fcb_laliga_db;

-- 2024/25 Season (Season 1)
INSERT INTO season_teams (season_id, team_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
(1, 16), (1, 17), (1, 18), (1, 19), (1, 20)
ON DUPLICATE KEY UPDATE season_id=VALUES(season_id);

-- 2023/24 Season (Season 2)
INSERT INTO season_teams (season_id, team_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 11), (2, 12), (2, 13), (2, 14), (2, 15),
(2, 16), (2, 17)
ON DUPLICATE KEY UPDATE season_id=VALUES(season_id);

-- 2022/23 Season (Season 3) - FC Barcelona Champions
INSERT INTO season_teams (season_id, team_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
(3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
(3, 18), (3, 20)
ON DUPLICATE KEY UPDATE season_id=VALUES(season_id);

-- 2014/15 Season (Season 6) - Treble Era (MSN)
INSERT INTO season_teams (season_id, team_id) VALUES
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5),
(6, 7), (6, 8), (6, 9), (6, 11), (6, 14),
(6, 18)
ON DUPLICATE KEY UPDATE season_id=VALUES(season_id);
