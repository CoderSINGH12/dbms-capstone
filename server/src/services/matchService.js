import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const matchService = {
  async getMatches({ seasonId, teamId, status, matchday, limit = 20, offset = 0 }) {
    let whereClauses = [];
    let params = [];

    if (seasonId) {
      whereClauses.push('m.season_id = ?');
      params.push(seasonId);
    }

    if (teamId) {
      whereClauses.push('(m.home_team_id = ? OR m.away_team_id = ?)');
      params.push(teamId, teamId);
    }

    if (status && status !== 'All') {
      whereClauses.push('m.status = ?');
      params.push(status);
    }

    if (matchday) {
      whereClauses.push('m.matchday = ?');
      params.push(matchday);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) AS total FROM matches m ${whereSql}`;
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    const dataSql = `
      SELECT 
        m.id,
        m.season_id,
        s.label AS season_label,
        m.matchday,
        m.kickoff_utc,
        m.status,
        m.home_score,
        m.away_score,
        m.venue,
        m.referee,
        th.id AS home_team_id,
        th.name AS home_name,
        th.short_name AS home_short_name,
        th.tla AS home_tla,
        th.crest_url AS home_crest,
        ta.id AS away_team_id,
        ta.name AS away_name,
        ta.short_name AS away_short_name,
        ta.tla AS away_tla,
        ta.crest_url AS away_crest,
        (SELECT COUNT(*) FROM player_match_stats WHERE match_id = m.id) AS stats_count
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      ${whereSql}
      ORDER BY 
        CASE m.status 
          WHEN 'finished' THEN 1 
          WHEN 'scheduled' THEN 2 
          ELSE 3 
        END,
        m.kickoff_utc DESC,
        m.matchday DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(dataSql, [...params, limit, offset]);
    return { matches: rows, total };
  },

  async getMatchById(matchId) {
    // 1. Match header and team info
    const [matchRows] = await pool.query(`
      SELECT 
        m.*,
        s.label AS season_label,
        s.start_year,
        th.name AS home_name,
        th.short_name AS home_short_name,
        th.tla AS home_tla,
        th.crest_url AS home_crest,
        th.stadium AS home_stadium,
        ta.name AS away_name,
        ta.short_name AS away_short_name,
        ta.tla AS away_tla,
        ta.crest_url AS away_crest,
        ta.stadium AS away_stadium
      FROM matches m
      JOIN seasons s ON m.season_id = s.id
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      WHERE m.id = ?
    `, [matchId]);

    if (!matchRows || matchRows.length === 0) return null;
    const match = matchRows[0];

    // 2. Per-Player Statistics for this match
    const [statsRows] = await pool.query(`
      SELECT 
        pms.registration_id,
        pms.started,
        pms.minutes,
        pms.goals,
        pms.assists,
        pms.yellow,
        pms.red,
        pr.team_id,
        pr.shirt_number,
        pr.position,
        p.id AS player_id,
        p.name AS player_name,
        p.nationality,
        p.image_url
      FROM player_match_stats pms
      JOIN player_registrations pr ON pms.registration_id = pr.id
      JOIN players p ON pr.player_id = p.id
      WHERE pms.match_id = ?
      ORDER BY pms.started DESC, pms.minutes DESC, pr.shirt_number ASC
    `, [matchId]);

    const homeStats = statsRows.filter(s => s.team_id === match.home_team_id);
    const awayStats = statsRows.filter(s => s.team_id === match.away_team_id);

    return {
      match,
      homeStats,
      awayStats,
      allStats: statsRows,
    };
  },

  async saveMatchResultWithStats(matchId, { home_score, away_score, status = 'finished', stats = [] }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check match existence
      const [existing] = await connection.query('SELECT * FROM matches WHERE id = ? FOR UPDATE', [matchId]);
      if (!existing || existing.length === 0) {
        throw new AppError(`Match with ID ${matchId} not found`, 404);
      }

      // Step 1: Update match score and status
      await connection.query(`
        UPDATE matches 
        SET home_score = ?, away_score = ?, status = ?
        WHERE id = ?
      `, [home_score, away_score, status, matchId]);

      // Step 2: Clear old stats if any
      await connection.query('DELETE FROM player_match_stats WHERE match_id = ?', [matchId]);

      // Step 3: Insert player stats atomically
      if (stats && stats.length > 0) {
        const insertSql = `
          INSERT INTO player_match_stats 
            (match_id, registration_id, started, minutes, goals, assists, yellow, red)
          VALUES ?
        `;
        const values = stats.map(s => [
          matchId,
          s.registration_id,
          s.started ? 1 : 0,
          s.minutes || 0,
          s.goals || 0,
          s.assists || 0,
          s.yellow || 0,
          s.red || 0,
        ]);

        await connection.query(insertSql, [values]);
      }

      await connection.commit();
      return { success: true, matchId, home_score, away_score, status, statsSaved: stats.length };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};
