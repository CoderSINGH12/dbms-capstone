-- ============================================================================
-- 03_indexes.sql
-- Performance indexes to optimize standings, search, filtering, and joins
-- ============================================================================

USE fcb_laliga_db;

-- Matches: Fast lookup by season and home/away team for standings & fixture lists
CREATE INDEX idx_matches_season_home ON matches(season_id, home_team_id);
CREATE INDEX idx_matches_season_away ON matches(season_id, away_team_id);

-- Matches: Fast head-to-head lookup across all historical seasons
CREATE INDEX idx_matches_h2h ON matches(home_team_id, away_team_id);

-- Matches: Status and date indexing for upcoming/recent fixtures
CREATE INDEX idx_matches_status_kickoff ON matches(status, kickoff_utc);

-- Player Registrations: Fast squad roster retrieval by season and team
CREATE INDEX idx_registrations_season_team ON player_registrations(season_id, team_id);

-- Player Match Stats: Fast aggregation of player totals across matches
CREATE INDEX idx_pms_registration ON player_match_stats(registration_id);

-- Players: Name search indexing for server-side autocomplete & filtering
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_players_nationality ON players(nationality);
