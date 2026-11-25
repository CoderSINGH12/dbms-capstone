import { pool } from '../config/db.js';

export const teamService = {
  async getAllTeams(seasonId = null) {
    if (seasonId) {
      const [rows] = await pool.query(`
        SELECT t.* 
        FROM season_teams st
        JOIN teams t ON st.team_id = t.id
        WHERE st.season_id = ?
        ORDER BY t.name ASC
      `, [seasonId]);
      return rows;
    }

    const [rows] = await pool.query(`
      SELECT t.*,
        (SELECT COUNT(DISTINCT season_id) FROM season_teams WHERE team_id = t.id) AS seasons_participated
      FROM teams t
      ORDER BY t.name ASC
    `);
    return rows;
  },

  async getTeamById(id) {
    const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getTeamSeasonSummary(teamId, seasonId) {
    // 1. Overall season stats from view
    const [summaryRows] = await pool.query(`
      SELECT * FROM v_team_season_summary
      WHERE team_id = ? AND season_id = ?
    `, [teamId, seasonId]);

    // 2. Standing details
    const [standingsRows] = await pool.query(`
      SELECT position, played, won, drawn, lost, gf, ga, gd, points
      FROM v_standings
      WHERE team_id = ? AND season_id = ?
    `, [teamId, seasonId]);

    // 3. Form Guide (Last 5 finished matches)
    const [formRows] = await pool.query(`
      SELECT 
        m.id, m.matchday, m.home_team_id, m.away_team_id, m.home_score, m.away_score, m.kickoff_utc,
        th.short_name AS home_name, ta.short_name AS away_name,
        CASE
          WHEN (m.home_team_id = ? AND m.home_score > m.away_score) OR (m.away_team_id = ? AND m.away_score > m.home_score) THEN 'W'
          WHEN m.home_score = m.away_score THEN 'D'
          ELSE 'L'
        END AS result
      FROM matches m
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      WHERE m.season_id = ? AND (m.home_team_id = ? OR m.away_team_id = ?) AND m.status = 'finished'
      ORDER BY m.matchday DESC
      LIMIT 5
    `, [teamId, teamId, seasonId, teamId, teamId]);

    // 4. Next upcoming match
    const [nextMatchRows] = await pool.query(`
      SELECT 
        m.id, m.matchday, m.home_team_id, m.away_team_id, m.kickoff_utc, m.venue,
        th.short_name AS home_name, th.crest_url AS home_crest,
        ta.short_name AS away_name, ta.crest_url AS away_crest
      FROM matches m
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      WHERE m.season_id = ? AND (m.home_team_id = ? OR m.away_team_id = ?) AND m.status = 'scheduled'
      ORDER BY m.matchday ASC
      LIMIT 1
    `, [seasonId, teamId, teamId]);

    // 5. Top performers in squad for this season
    const [topScorers] = await pool.query(`
      SELECT p.id, p.name, pr.position, pr.shirt_number, v.goals, v.assists, v.appearances, p.image_url
      FROM v_player_season_totals v
      JOIN players p ON v.player_id = p.id
      JOIN player_registrations pr ON v.registration_id = pr.id
      WHERE v.team_id = ? AND v.season_id = ?
      ORDER BY v.goals DESC, v.assists DESC
      LIMIT 5
    `, [teamId, seasonId]);

    return {
      summary: summaryRows[0] || null,
      standings: standingsRows[0] || null,
      recentForm: formRows,
      nextMatch: nextMatchRows[0] || null,
      topScorers,
    };
  },

  async getTeamSquad(teamId, seasonId) {
    const [rows] = await pool.query(`
      SELECT 
        pr.id AS registration_id,
        p.id AS player_id,
        p.name,
        p.nationality,
        p.date_of_birth,
        p.image_url,
        pr.shirt_number,
        pr.position,
        v.appearances,
        v.starts,
        v.minutes,
        v.goals,
        v.assists,
        v.yellow,
        v.red
      FROM player_registrations pr
      JOIN players p ON pr.player_id = p.id
      LEFT JOIN v_player_season_totals v ON pr.id = v.registration_id
      WHERE pr.team_id = ? AND pr.season_id = ?
      ORDER BY 
        CASE pr.position
          WHEN 'Goalkeeper' THEN 1
          WHEN 'Defender' THEN 2
          WHEN 'Midfielder' THEN 3
          WHEN 'Forward' THEN 4
          ELSE 5
        END,
        pr.shirt_number ASC,
        p.name ASC
    `, [teamId, seasonId]);
    return rows;
  },
};
