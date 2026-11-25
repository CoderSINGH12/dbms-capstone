-- ============================================================================
-- 09_all_20_reports_suite.sql
-- The complete suite of 20 advanced SQL reports demonstrating core DBMS concepts:
-- SELECT, JOIN, AGGREGATES, GROUP BY, HAVING, SUBQUERIES, CORRELATED SUBQUERIES,
-- WINDOW FUNCTIONS (RANK, LAG), NOT EXISTS, RECONCILIATION, and TRANSACTIONS.
-- ============================================================================

USE fcb_laliga_db;

-- ----------------------------------------------------------------------------
-- REPORT 1: Clubs participating in a given season
-- Concepts: SELECT, INNER JOIN, ORDER BY
-- UI Context: LaLiga Hub club selector
-- ----------------------------------------------------------------------------
SELECT 
  t.id AS team_id,
  t.name,
  t.short_name,
  t.city,
  t.stadium,
  t.founded_year
FROM season_teams st
JOIN teams t ON st.team_id = t.id
WHERE st.season_id = 1
ORDER BY t.name ASC;

-- ----------------------------------------------------------------------------
-- REPORT 2: Distinct nationalities represented in FC Barcelona's squad
-- Concepts: DISTINCT, INNER JOIN, WHERE
-- UI Context: Players directory filter dropdown
-- ----------------------------------------------------------------------------
SELECT DISTINCT 
  p.nationality
FROM player_registrations pr
JOIN players p ON pr.player_id = p.id
WHERE pr.team_id = 1 AND pr.season_id = 1 AND p.nationality IS NOT NULL
ORDER BY p.nationality ASC;

-- ----------------------------------------------------------------------------
-- REPORT 3: Season Standings (Computed dynamically from match results)
-- Concepts: View querying, CASE expressions, GROUP BY, Aggregates
-- UI Context: Standings Table / Hub
-- ----------------------------------------------------------------------------
SELECT 
  position,
  team_name,
  played,
  won,
  drawn,
  lost,
  gf,
  ga,
  gd,
  points
FROM v_standings
WHERE season_id = 1
ORDER BY position ASC;

-- ----------------------------------------------------------------------------
-- REPORT 4: Elite Clubs Achieving 70+ Points in a Season
-- Concepts: GROUP BY, HAVING, Aggregation
-- UI Context: Historical benchmarks
-- ----------------------------------------------------------------------------
SELECT 
  s.label AS season,
  t.name AS team_name,
  fs.points,
  fs.won,
  fs.gf
FROM final_standings fs
JOIN seasons s ON fs.season_id = s.id
JOIN teams t ON fs.team_id = t.id
GROUP BY s.label, t.name, fs.points, fs.won, fs.gf
HAVING fs.points >= 70
ORDER BY fs.points DESC;

-- ----------------------------------------------------------------------------
-- REPORT 5: FC Barcelona Season Performance Aggregates
-- Concepts: SUM, CASE expressions, Multi-table JOIN
-- UI Context: Dashboard season summary
-- ----------------------------------------------------------------------------
SELECT 
  s.label AS season,
  COUNT(m.id) AS total_matches,
  SUM(CASE WHEN (m.home_team_id = 1 AND m.home_score > m.away_score) OR (m.away_team_id = 1 AND m.away_score > m.home_score) THEN 1 ELSE 0 END) AS wins,
  SUM(CASE WHEN m.home_score = m.away_score THEN 1 ELSE 0 END) AS draws,
  SUM(CASE WHEN (m.home_team_id = 1 AND m.home_score < m.away_score) OR (m.away_team_id = 1 AND m.away_score < m.home_score) THEN 1 ELSE 0 END) AS losses,
  SUM(CASE WHEN m.home_team_id = 1 THEN m.home_score ELSE m.away_score END) AS goals_scored,
  SUM(CASE WHEN m.home_team_id = 1 THEN m.away_score ELSE m.home_score END) AS goals_conceded,
  (SUM(CASE WHEN m.home_team_id = 1 THEN m.home_score ELSE m.away_score END) - 
   SUM(CASE WHEN m.home_team_id = 1 THEN m.away_score ELSE m.home_score END)) AS goal_difference
FROM matches m
JOIN seasons s ON m.season_id = s.id
WHERE (m.home_team_id = 1 OR m.away_team_id = 1) AND m.status = 'finished'
GROUP BY s.id, s.label
ORDER BY s.start_year DESC;

-- ----------------------------------------------------------------------------
-- REPORT 6: Home vs Away Performance Breakdown
-- Concepts: CASE, Conditional SUM, Ratio calculation
-- UI Context: Compare page & Analytics Home/Away split
-- ----------------------------------------------------------------------------
SELECT 
  team_name,
  home_played,
  home_won,
  home_gf,
  home_ga,
  away_played,
  away_won,
  away_gf,
  away_ga,
  clean_sheets
FROM v_team_season_summary
WHERE season_id = 1
ORDER BY (home_won + away_won) DESC;

-- ----------------------------------------------------------------------------
-- REPORT 7: Top Goal Scorers in La Liga
-- Concepts: JOIN, SUM, LIMIT, Filtering
-- UI Context: Analytics Pichichi leaderboard
-- ----------------------------------------------------------------------------
SELECT 
  p.name AS player_name,
  t.short_name AS team_name,
  v.position,
  v.goals,
  v.appearances,
  ROUND(v.goals / NULLIF(v.appearances, 0), 2) AS goals_per_game
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN teams t ON v.team_id = t.id
WHERE v.season_id = 1
ORDER BY v.goals DESC, v.appearances ASC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- REPORT 8: Top Assist Providers
-- Concepts: JOIN, ORDER BY, LIMIT
-- UI Context: Analytics Playmaker leaderboard
-- ----------------------------------------------------------------------------
SELECT 
  p.name AS player_name,
  t.short_name AS team_name,
  v.assists,
  v.appearances,
  v.minutes
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN teams t ON v.team_id = t.id
WHERE v.season_id = 1
ORDER BY v.assists DESC, v.minutes ASC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- REPORT 9: Iron Men (Minutes and Appearance Leaders)
-- Concepts: ORDER BY minutes DESC, Aggregation
-- UI Context: Analytics stamina rankings
-- ----------------------------------------------------------------------------
SELECT 
  p.name AS player_name,
  t.short_name AS team_name,
  v.position,
  v.appearances,
  v.starts,
  v.minutes
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN teams t ON v.team_id = t.id
WHERE v.season_id = 1
ORDER BY v.minutes DESC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- REPORT 10: Disciplinary Ranking (Cards Leaderboard)
-- Concepts: SUM, Weighted Disciplinary Points, HAVING
-- UI Context: Analytics Disciplinary chart
-- ----------------------------------------------------------------------------
SELECT 
  p.name AS player_name,
  t.short_name AS team_name,
  v.yellow,
  v.red,
  ((v.yellow * 1) + (v.red * 3)) AS disciplinary_points
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN teams t ON v.team_id = t.id
WHERE v.season_id = 1
HAVING disciplinary_points > 0
ORDER BY disciplinary_points DESC, v.red DESC, v.yellow DESC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- REPORT 11: Head-to-Head Record Between Two Specific Clubs (e.g. Barça vs Real Madrid)
-- Concepts: Self-joining conditions, Cross-season aggregation
-- UI Context: Compare page (H2H module)
-- ----------------------------------------------------------------------------
SELECT 
  COUNT(m.id) AS total_played,
  SUM(CASE 
    WHEN m.home_team_id = 1 AND m.home_score > m.away_score THEN 1 
    WHEN m.away_team_id = 1 AND m.away_score > m.home_score THEN 1 
    ELSE 0 
  END) AS barca_wins,
  SUM(CASE WHEN m.home_score = m.away_score THEN 1 ELSE 0 END) AS draws,
  SUM(CASE 
    WHEN m.home_team_id = 2 AND m.home_score > m.away_score THEN 1 
    WHEN m.away_team_id = 2 AND m.away_score > m.home_score THEN 1 
    ELSE 0 
  END) AS real_madrid_wins,
  SUM(CASE WHEN m.home_team_id = 1 THEN m.home_score ELSE m.away_score END) AS barca_goals,
  SUM(CASE WHEN m.home_team_id = 2 THEN m.home_score ELSE m.away_score END) AS real_madrid_goals
FROM matches m
WHERE ((m.home_team_id = 1 AND m.away_team_id = 2) OR (m.home_team_id = 2 AND m.away_team_id = 1))
  AND m.status = 'finished';

-- ----------------------------------------------------------------------------
-- REPORT 12: Players Performing Above Squad-Average Goals
-- Concepts: Non-correlated Subquery, AVG() in WHERE
-- UI Context: Player Profile standout metrics
-- ----------------------------------------------------------------------------
SELECT 
  p.name,
  v.goals,
  v.appearances
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
WHERE v.team_id = 1 AND v.season_id = 1
  AND v.goals > (
    SELECT AVG(sub.goals) 
    FROM v_player_season_totals sub 
    WHERE sub.team_id = 1 AND sub.season_id = 1 AND sub.appearances > 0
  )
ORDER BY v.goals DESC;

-- ----------------------------------------------------------------------------
-- REPORT 13: Each Team's Biggest Win in a Given Season
-- Concepts: Correlated Subquery
-- UI Context: Team Detail page honors
-- ----------------------------------------------------------------------------
SELECT 
  t.name AS team_name,
  m.matchday,
  m.home_score,
  m.away_score,
  opp.name AS opponent,
  ABS(m.home_score - m.away_score) AS goal_margin
FROM matches m
JOIN teams t ON (m.home_team_id = t.id AND m.home_score > m.away_score) 
             OR (m.away_team_id = t.id AND m.away_score > m.home_score)
JOIN teams opp ON (opp.id = CASE WHEN m.home_team_id = t.id THEN m.away_team_id ELSE m.home_team_id END)
WHERE m.season_id = 1 AND m.status = 'finished'
  AND ABS(m.home_score - m.away_score) = (
    SELECT MAX(ABS(sub.home_score - sub.away_score))
    FROM matches sub
    WHERE sub.season_id = 1 AND sub.status = 'finished'
      AND ((sub.home_team_id = t.id AND sub.home_score > sub.away_score) 
        OR (sub.away_team_id = t.id AND sub.away_score > sub.home_score))
  )
ORDER BY goal_margin DESC;

-- ----------------------------------------------------------------------------
-- REPORT 14: Season-by-Season Player Goal Progression
-- Concepts: Window Function LAG() OVER (ORDER BY ...)
-- UI Context: Player Profile progression chart
-- ----------------------------------------------------------------------------
SELECT 
  p.name,
  s.label AS season,
  v.appearances,
  v.goals,
  LAG(v.goals, 1, 0) OVER (
    PARTITION BY p.id 
    ORDER BY s.start_year ASC
  ) AS prev_season_goals,
  (v.goals - LAG(v.goals, 1, 0) OVER (
    PARTITION BY p.id 
    ORDER BY s.start_year ASC
  )) AS goal_delta
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN seasons s ON v.season_id = s.id
WHERE p.id IN (1, 2, 3) -- Lamine, Lewandowski, Raphinha
ORDER BY p.id, s.start_year ASC;

-- ----------------------------------------------------------------------------
-- REPORT 15: Rank Scorers Within Each Team
-- Concepts: Window Function RANK() OVER (PARTITION BY team_id ORDER BY goals DESC)
-- UI Context: Team squad top performers
-- ----------------------------------------------------------------------------
SELECT 
  t.short_name AS team,
  p.name AS player_name,
  v.goals,
  RANK() OVER (
    PARTITION BY v.team_id 
    ORDER BY v.goals DESC
  ) AS intra_team_rank
FROM v_player_season_totals v
JOIN players p ON v.player_id = p.id
JOIN teams t ON v.team_id = t.id
WHERE v.season_id = 1 AND v.goals > 0
ORDER BY t.short_name, intra_team_rank ASC;

-- ----------------------------------------------------------------------------
-- REPORT 16: Standings Reconciliation (Computed vs Official Standings Audit)
-- Concepts: FULL/LEFT JOIN, ABS diff check
-- UI Context: Admin Standings reconciliation panel
-- ----------------------------------------------------------------------------
SELECT 
  t.name AS team_name,
  comp.points AS computed_points,
  off.points AS official_points,
  (comp.points - off.points) AS point_discrepancy,
  comp.position AS computed_pos,
  off.position AS official_pos,
  CASE 
    WHEN comp.points = off.points AND comp.position = off.position THEN 'VERIFIED'
    ELSE 'DISCREPANCY'
  END AS audit_status
FROM v_standings comp
LEFT JOIN final_standings off ON comp.season_id = off.season_id AND comp.team_id = off.team_id
JOIN teams t ON comp.team_id = t.id
WHERE comp.season_id = 2; -- 2023/24 completed season audit

-- ----------------------------------------------------------------------------
-- REPORT 17: Complete Squad & Registration History of a Player
-- Concepts: Multi-table JOIN across historical registrations
-- UI Context: Player Profile career timeline
-- ----------------------------------------------------------------------------
SELECT 
  p.name,
  s.label AS season,
  t.name AS club,
  pr.shirt_number,
  pr.position,
  pr.joined_on,
  pr.left_on,
  v.appearances,
  v.goals,
  v.assists
FROM player_registrations pr
JOIN players p ON pr.player_id = p.id
JOIN teams t ON pr.team_id = t.id
JOIN seasons s ON pr.season_id = s.id
LEFT JOIN v_player_season_totals v ON pr.id = v.registration_id
WHERE p.id = 1 -- Lamine Yamal
ORDER BY s.start_year ASC;

-- ----------------------------------------------------------------------------
-- REPORT 18: Clubs Promoted or Relegated Between Consecutive Seasons
-- Concepts: NOT EXISTS / Anti-join
-- UI Context: LaLiga Hub turnover analysis
-- ----------------------------------------------------------------------------
-- Newly added clubs in 2024/25 that were NOT in 2023/24
SELECT 
  'Promoted' AS movement_type,
  t.name AS club_name
FROM season_teams curr
JOIN teams t ON curr.team_id = t.id
WHERE curr.season_id = 1
  AND NOT EXISTS (
    SELECT 1 FROM season_teams prev 
    WHERE prev.season_id = 2 AND prev.team_id = curr.team_id
  );

-- ----------------------------------------------------------------------------
-- REPORT 19: Atomic Transaction - Save Match Result Together with Player Stats
-- Concepts: START TRANSACTION, Multi-table atomic write, COMMIT / ROLLBACK
-- UI Context: Admin Match Results Entry
-- ----------------------------------------------------------------------------
-- Demonstrates atomic consistency: if match or stats fail validation, everything rolls back.
/*
START TRANSACTION;

UPDATE matches 
SET home_score = 3, away_score = 0, status = 'finished'
WHERE id = 45;

INSERT INTO player_match_stats (match_id, registration_id, started, minutes, goals, assists)
VALUES (45, 1, 1, 90, 1, 1);

COMMIT;
*/

-- ----------------------------------------------------------------------------
-- REPORT 20: Performance Index Verification with EXPLAIN
-- Concepts: EXPLAIN, Index usage, Cost reduction
-- UI Context: Database optimization documentation
-- ----------------------------------------------------------------------------
EXPLAIN SELECT * FROM matches 
WHERE season_id = 1 AND home_team_id = 1;
