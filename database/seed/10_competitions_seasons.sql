-- ============================================================================
-- 10_competitions_seasons.sql
-- Seed competitions, seasons, and verified data sources
-- ============================================================================

USE fcb_laliga_db;

-- Competitions
INSERT INTO competitions (id, code, name, country) VALUES
(1, 'PD', 'La Liga EA Sports', 'Spain')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seasons (Coverage: verified vs partial)
INSERT INTO seasons (id, competition_id, label, start_year, end_year, status, coverage) VALUES
(1, 1, '2024/25', 2024, 2025, 'current',   'verified'),
(2, 1, '2023/24', 2023, 2024, 'completed', 'verified'),
(3, 1, '2022/23', 2022, 2023, 'completed', 'verified'),
(4, 1, '2021/22', 2021, 2022, 'completed', 'partial'),
(5, 1, '2020/21', 2020, 2021, 'completed', 'partial'),
(6, 1, '2014/15', 2014, 2015, 'completed', 'verified')
ON DUPLICATE KEY UPDATE label=VALUES(label), status=VALUES(status), coverage=VALUES(coverage);

-- Data Sources
INSERT INTO data_sources (id, code, name, url, license, notes) VALUES
(1, 'LALIGA_OFFICIAL', 'LaLiga Official Match Records', 'https://www.laliga.com', 'Official / Fair Use', 'Verified final standings and official scores.'),
(2, 'FOOTBALL_DATA_ORG', 'Football-Data.org API v4', 'https://api.football-data.org', 'CC BY-NC 4.0', 'Match schedules, referee, and competition metadata.'),
(3, 'STATSBOMB_OPEN', 'StatsBomb Open Data', 'https://statsbomb.com', 'Open Data License', 'Detailed match-level event and player statistics.')
ON DUPLICATE KEY UPDATE name=VALUES(name);
