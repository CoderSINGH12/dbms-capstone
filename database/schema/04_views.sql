-- ============================================================================
-- 04_views.sql
-- Dynamically computed standings, player season totals, and team summaries
-- ============================================================================

USE fcb_laliga_db;

-- 1. DYNAMIC STANDINGS VIEW (v_standings)
-- Computes real-time table from verified finished matches without storing redundancy
CREATE OR REPLACE VIEW v_standings AS
WITH team_match_outcomes AS (
  SELECT
    st.season_id,
    st.team_id,
    t.name AS team_name,
    t.short_name,
    t.tla,
    t.crest_url,
    m.id AS match_id,
    -- Match Played
    CASE WHEN m.id IS NOT NULL AND m.status = 'finished' THEN 1 ELSE 0 END AS played,
    -- Won
    CASE 
      WHEN m.status = 'finished' AND m.home_team_id = st.team_id AND m.home_score > m.away_score THEN 1
      WHEN m.status = 'finished' AND m.away_team_id = st.team_id AND m.away_score > m.home_score THEN 1
      ELSE 0
    END AS won,
    -- Drawn
    CASE 
      WHEN m.status = 'finished' AND m.home_score = m.away_score THEN 1
      ELSE 0
    END AS drawn,
    -- Lost
    CASE 
      WHEN m.status = 'finished' AND m.home_team_id = st.team_id AND m.home_score < m.away_score THEN 1
      WHEN m.status = 'finished' AND m.away_team_id = st.team_id AND m.away_score < m.home_score THEN 1
      ELSE 0
    END AS lost,
    -- Goals For
    CASE 
      WHEN m.status = 'finished' AND m.home_team_id = st.team_id THEN m.home_score
      WHEN m.status = 'finished' AND m.away_team_id = st.team_id THEN m.away_score
      ELSE 0
    END AS gf,
    -- Goals Against
    CASE 
      WHEN m.status = 'finished' AND m.home_team_id = st.team_id THEN m.away_score
      WHEN m.status = 'finished' AND m.away_team_id = st.team_id THEN m.home_score
      ELSE 0
    END AS ga
  FROM season_teams st
  JOIN teams t ON st.team_id = t.id
  LEFT JOIN matches m ON st.season_id = m.season_id 
    AND (m.home_team_id = st.team_id OR m.away_team_id = st.team_id)
    AND m.status = 'finished'
),
aggregated_totals AS (
  SELECT
    season_id,
    team_id,
    team_name,
    short_name,
    tla,
    crest_url,
    COALESCE(SUM(played), 0) AS played,
    COALESCE(SUM(won), 0) AS won,
    COALESCE(SUM(drawn), 0) AS drawn,
    COALESCE(SUM(lost), 0) AS lost,
    COALESCE(SUM(gf), 0) AS gf,
    COALESCE(SUM(ga), 0) AS ga,
    COALESCE(SUM(gf) - SUM(ga), 0) AS gd,
    COALESCE((SUM(won) * 3) + SUM(drawn), 0) AS points
  FROM team_match_outcomes
  GROUP BY season_id, team_id, team_name, short_name, tla, crest_url
)
SELECT
  season_id,
  team_id,
  team_name,
  short_name,
  tla,
  crest_url,
  played,
  won,
  drawn,
  lost,
  gf,
  ga,
  gd,
  points,
  RANK() OVER (
    PARTITION BY season_id 
    ORDER BY points DESC, gd DESC, gf DESC, team_name ASC
  ) AS position
FROM aggregated_totals;

-- 2. PLAYER SEASON TOTALS VIEW (v_player_season_totals)
-- Integrates match-level stats with historical aggregate records
CREATE OR REPLACE VIEW v_player_season_totals AS
SELECT 
  pr.id AS registration_id,
  pr.player_id,
  pr.season_id,
  pr.team_id,
  p.name AS player_name,
  p.nationality,
  pr.shirt_number,
  pr.position,
  t.name AS team_name,
  s.label AS season_label,
  -- Check if match-level stats exist; if so, aggregate them; otherwise fall back to player_season_stats
  COALESCE(
    match_agg.appearances,
    pss.appearances,
    0
  ) AS appearances,
  COALESCE(
    match_agg.starts,
    pss.starts,
    0
  ) AS starts,
  COALESCE(
    match_agg.minutes,
    pss.minutes,
    0
  ) AS minutes,
  COALESCE(
    match_agg.goals,
    pss.goals,
    0
  ) AS goals,
  COALESCE(
    match_agg.assists,
    pss.assists,
    0
  ) AS assists,
  COALESCE(
    match_agg.yellow,
    pss.yellow,
    0
  ) AS yellow,
  COALESCE(
    match_agg.red,
    pss.red,
    0
  ) AS red,
  CASE WHEN match_agg.appearances IS NOT NULL THEN 'match_level' ELSE 'aggregate' END AS data_depth
FROM player_registrations pr
JOIN players p ON pr.player_id = p.id
JOIN teams t ON pr.team_id = t.id
JOIN seasons s ON pr.season_id = s.id
LEFT JOIN (
  SELECT 
    registration_id,
    COUNT(CASE WHEN minutes > 0 THEN 1 END) AS appearances,
    SUM(CASE WHEN started = 1 THEN 1 ELSE 0 END) AS starts,
    SUM(minutes) AS minutes,
    SUM(goals) AS goals,
    SUM(assists) AS assists,
    SUM(yellow) AS yellow,
    SUM(red) AS red
  FROM player_match_stats
  GROUP BY registration_id
) match_agg ON pr.id = match_agg.registration_id
LEFT JOIN player_season_stats pss ON pr.id = pss.registration_id;

-- 3. TEAM SEASON SUMMARY VIEW (v_team_season_summary)
-- Provides detailed home/away splits, goal averages, and clean sheets
CREATE OR REPLACE VIEW v_team_season_summary AS
SELECT
  st.season_id,
  st.team_id,
  t.name AS team_name,
  t.short_name,
  s.label AS season_label,
  -- Home record
  COUNT(CASE WHEN m.home_team_id = st.team_id AND m.status = 'finished' THEN 1 END) AS home_played,
  SUM(CASE WHEN m.home_team_id = st.team_id AND m.home_score > m.away_score THEN 1 ELSE 0 END) AS home_won,
  SUM(CASE WHEN m.home_team_id = st.team_id AND m.home_score = m.away_score THEN 1 ELSE 0 END) AS home_drawn,
  SUM(CASE WHEN m.home_team_id = st.team_id AND m.home_score < m.away_score THEN 1 ELSE 0 END) AS home_lost,
  SUM(CASE WHEN m.home_team_id = st.team_id THEN m.home_score ELSE 0 END) AS home_gf,
  SUM(CASE WHEN m.home_team_id = st.team_id THEN m.away_score ELSE 0 END) AS home_ga,
  -- Away record
  COUNT(CASE WHEN m.away_team_id = st.team_id AND m.status = 'finished' THEN 1 END) AS away_played,
  SUM(CASE WHEN m.away_team_id = st.team_id AND m.away_score > m.home_score THEN 1 ELSE 0 END) AS away_won,
  SUM(CASE WHEN m.away_team_id = st.team_id AND m.away_score = m.home_score THEN 1 ELSE 0 END) AS away_drawn,
  SUM(CASE WHEN m.away_team_id = st.team_id AND m.away_score < m.home_score THEN 1 ELSE 0 END) AS away_lost,
  SUM(CASE WHEN m.away_team_id = st.team_id THEN m.away_score ELSE 0 END) AS away_gf,
  SUM(CASE WHEN m.away_team_id = st.team_id THEN m.home_score ELSE 0 END) AS away_ga,
  -- Clean sheets kept
  SUM(CASE 
    WHEN m.home_team_id = st.team_id AND m.away_score = 0 THEN 1 
    WHEN m.away_team_id = st.team_id AND m.home_score = 0 THEN 1 
    ELSE 0 
  END) AS clean_sheets
FROM season_teams st
JOIN teams t ON st.team_id = t.id
JOIN seasons s ON st.season_id = s.id
LEFT JOIN matches m ON st.season_id = m.season_id 
  AND (m.home_team_id = st.team_id OR m.away_team_id = st.team_id)
  AND m.status = 'finished'
GROUP BY st.season_id, st.team_id, t.name, t.short_name, s.label;
