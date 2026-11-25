import { pool } from '../config/db.js';

export const analyticsService = {
  async getTopScorers(seasonId, limit = 10) {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS player_id,
        p.name AS player_name,
        p.nationality,
        p.image_url,
        pr.shirt_number,
        pr.position,
        t.id AS team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        v.goals,
        v.appearances,
        v.minutes,
        ROUND(v.goals / NULLIF(v.appearances, 0), 2) AS goals_per_game,
        RANK() OVER (ORDER BY v.goals DESC, v.appearances ASC) AS rank_position
      FROM v_player_season_totals v
      JOIN players p ON v.player_id = p.id
      JOIN teams t ON v.team_id = t.id
      JOIN player_registrations pr ON v.registration_id = pr.id
      WHERE v.season_id = ? AND v.goals > 0
      ORDER BY v.goals DESC, v.appearances ASC
      LIMIT ?
    `, [seasonId, limit]);
    return rows;
  },

  async getTopAssists(seasonId, limit = 10) {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS player_id,
        p.name AS player_name,
        p.nationality,
        p.image_url,
        pr.shirt_number,
        pr.position,
        t.id AS team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        v.assists,
        v.appearances,
        v.minutes,
        ROUND(v.assists / NULLIF(v.appearances, 0), 2) AS assists_per_game,
        RANK() OVER (ORDER BY v.assists DESC, v.minutes ASC) AS rank_position
      FROM v_player_season_totals v
      JOIN players p ON v.player_id = p.id
      JOIN teams t ON v.team_id = t.id
      JOIN player_registrations pr ON v.registration_id = pr.id
      WHERE v.season_id = ? AND v.assists > 0
      ORDER BY v.assists DESC, v.minutes ASC
      LIMIT ?
    `, [seasonId, limit]);
    return rows;
  },

  async getDisciplinary(seasonId, limit = 10) {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS player_id,
        p.name AS player_name,
        p.nationality,
        p.image_url,
        pr.shirt_number,
        pr.position,
        t.id AS team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        v.yellow,
        v.red,
        ((v.yellow * 1) + (v.red * 3)) AS disciplinary_points,
        v.appearances
      FROM v_player_season_totals v
      JOIN players p ON v.player_id = p.id
      JOIN teams t ON v.team_id = t.id
      JOIN player_registrations pr ON v.registration_id = pr.id
      WHERE v.season_id = ? AND (v.yellow > 0 OR v.red > 0)
      ORDER BY disciplinary_points DESC, v.red DESC, v.yellow DESC
      LIMIT ?
    `, [seasonId, limit]);
    return rows;
  },

  async getMinutesLeaders(seasonId, limit = 10) {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS player_id,
        p.name AS player_name,
        p.nationality,
        p.image_url,
        pr.shirt_number,
        pr.position,
        t.id AS team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        v.minutes,
        v.appearances,
        v.starts
      FROM v_player_season_totals v
      JOIN players p ON v.player_id = p.id
      JOIN teams t ON v.team_id = t.id
      JOIN player_registrations pr ON v.registration_id = pr.id
      WHERE v.season_id = ? AND v.minutes > 0
      ORDER BY v.minutes DESC
      LIMIT ?
    `, [seasonId, limit]);
    return rows;
  },

  async getHeadToHead(teamAId, teamBId) {
    // 1. Team A & Team B metadata
    const [teams] = await pool.query('SELECT id, name, short_name, crest_url, stadium FROM teams WHERE id IN (?, ?)', [teamAId, teamBId]);
    const teamA = teams.find(t => t.id === Number(teamAId));
    const teamB = teams.find(t => t.id === Number(teamBId));

    if (!teamA || !teamB) {
      return null;
    }

    // 2. Head-to-Head matches across all seasons
    const [matches] = await pool.query(`
      SELECT 
        m.id,
        m.season_id,
        s.label AS season_label,
        m.matchday,
        m.kickoff_utc,
        m.home_team_id,
        m.away_team_id,
        th.short_name AS home_name,
        ta.short_name AS away_name,
        m.home_score,
        m.away_score,
        m.venue,
        CASE
          WHEN (m.home_team_id = ? AND m.home_score > m.away_score) OR (m.away_team_id = ? AND m.away_score > m.home_score) THEN 'TEAM_A_WIN'
          WHEN (m.home_team_id = ? AND m.home_score > m.away_score) OR (m.away_team_id = ? AND m.away_score > m.home_score) THEN 'TEAM_B_WIN'
          ELSE 'DRAW'
        END AS outcome
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      WHERE ((m.home_team_id = ? AND m.away_team_id = ?) OR (m.home_team_id = ? AND m.away_team_id = ?))
        AND m.status = 'finished'
      ORDER BY m.kickoff_utc DESC, s.start_year DESC
    `, [teamAId, teamAId, teamBId, teamBId, teamAId, teamBId, teamBId, teamAId]);

    // 3. Aggregate totals
    let teamAWins = 0;
    let teamBWins = 0;
    let draws = 0;
    let teamAGoals = 0;
    let teamBGoals = 0;

    matches.forEach(m => {
      if (m.outcome === 'TEAM_A_WIN') teamAWins++;
      else if (m.outcome === 'TEAM_B_WIN') teamBWins++;
      else draws++;

      if (m.home_team_id === Number(teamAId)) {
        teamAGoals += m.home_score;
        teamBGoals += m.away_score;
      } else {
        teamAGoals += m.away_score;
        teamBGoals += m.home_score;
      }
    });

    return {
      teamA,
      teamB,
      totalPlayed: matches.length,
      teamAWins,
      teamBWins,
      draws,
      teamAGoals,
      teamBGoals,
      matches,
    };
  },

  async compareSeasons(seasonIds = [1, 2, 6]) {
    const placeholders = seasonIds.map(() => '?').join(',');
    const [rows] = await pool.query(`
      SELECT 
        s.id AS season_id,
        s.label AS season_label,
        s.start_year,
        s.status,
        -- Barça aggregates
        COUNT(m.id) AS barca_matches,
        SUM(CASE WHEN (m.home_team_id = 1 AND m.home_score > m.away_score) OR (m.away_team_id = 1 AND m.away_score > m.home_score) THEN 1 ELSE 0 END) AS barca_wins,
        SUM(CASE WHEN m.home_score = m.away_score THEN 1 ELSE 0 END) AS barca_draws,
        SUM(CASE WHEN (m.home_team_id = 1 AND m.home_score < m.away_score) OR (m.away_team_id = 1 AND m.away_score < m.home_score) THEN 1 ELSE 0 END) AS barca_losses,
        SUM(CASE WHEN m.home_team_id = 1 THEN m.home_score ELSE m.away_score END) AS barca_gf,
        SUM(CASE WHEN m.home_team_id = 1 THEN m.away_score ELSE m.home_score END) AS barca_ga,
        (SUM(CASE WHEN m.home_team_id = 1 THEN m.home_score ELSE m.away_score END) - 
         SUM(CASE WHEN m.home_team_id = 1 THEN m.away_score ELSE m.home_score END)) AS barca_gd,
        (SUM(CASE WHEN (m.home_team_id = 1 AND m.home_score > m.away_score) OR (m.away_team_id = 1 AND m.away_score > m.home_score) THEN 3 WHEN m.home_score = m.away_score THEN 1 ELSE 0 END)) AS barca_points
      FROM seasons s
      LEFT JOIN matches m ON s.id = m.season_id AND (m.home_team_id = 1 OR m.away_team_id = 1) AND m.status = 'finished'
      WHERE s.id IN (${placeholders})
      GROUP BY s.id, s.label, s.start_year, s.status
      ORDER BY s.start_year ASC
    `, seasonIds);

    return rows;
  },

  async comparePlayers(playerAId, playerBId, seasonId) {
    const [players] = await pool.query(`
      SELECT 
        p.id AS player_id,
        p.name,
        p.nationality,
        p.date_of_birth,
        p.image_url,
        pr.shirt_number,
        pr.position,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        s.label AS season_label,
        COALESCE(v.appearances, 0) AS appearances,
        COALESCE(v.starts, 0) AS starts,
        COALESCE(v.minutes, 0) AS minutes,
        COALESCE(v.goals, 0) AS goals,
        COALESCE(v.assists, 0) AS assists,
        COALESCE(v.yellow, 0) AS yellow,
        COALESCE(v.red, 0) AS red,
        ROUND(COALESCE(v.goals, 0) / NULLIF(v.appearances, 0), 2) AS goals_per_game,
        ROUND(COALESCE(v.assists, 0) / NULLIF(v.appearances, 0), 2) AS assists_per_game,
        ROUND(COALESCE(v.minutes, 0) / NULLIF(v.goals, 0), 0) AS minutes_per_goal
      FROM players p
      JOIN player_registrations pr ON p.id = pr.player_id
      JOIN teams t ON pr.team_id = t.id
      JOIN seasons s ON pr.season_id = s.id
      LEFT JOIN v_player_season_totals v ON pr.id = v.registration_id
      WHERE p.id IN (?, ?) AND pr.season_id = ?
    `, [playerAId, playerBId, seasonId]);

    const playerA = players.find(p => p.player_id === Number(playerAId)) || null;
    const playerB = players.find(p => p.player_id === Number(playerBId)) || null;

    return { playerA, playerB };
  },
};
