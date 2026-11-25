import { pool } from '../config/db.js';

export const playerService = {
  async getPlayers({ seasonId, teamId, position, nationality, q, sort = 'goals_desc', limit = 10, offset = 0 }) {
    let whereClauses = [];
    let params = [];

    if (seasonId) {
      whereClauses.push('pr.season_id = ?');
      params.push(seasonId);
    }

    if (teamId) {
      whereClauses.push('pr.team_id = ?');
      params.push(teamId);
    }

    if (position && position !== 'All') {
      whereClauses.push('pr.position = ?');
      params.push(position);
    }

    if (nationality && nationality !== 'All') {
      whereClauses.push('p.nationality = ?');
      params.push(nationality);
    }

    if (q && q.trim()) {
      whereClauses.push('(p.name LIKE ? OR t.name LIKE ?)');
      const searchPattern = `%${q.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Total Count query
    const countSql = `
      SELECT COUNT(DISTINCT pr.id) AS total
      FROM player_registrations pr
      JOIN players p ON pr.player_id = p.id
      JOIN teams t ON pr.team_id = t.id
      ${whereSql}
    `;
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Sort mapping
    let orderSql = 'v.goals DESC, v.assists DESC, p.name ASC';
    switch (sort) {
      case 'goals_asc': orderSql = 'v.goals ASC'; break;
      case 'goals_desc': orderSql = 'v.goals DESC'; break;
      case 'assists_asc': orderSql = 'v.assists ASC'; break;
      case 'assists_desc': orderSql = 'v.assists DESC'; break;
      case 'minutes_desc': orderSql = 'v.minutes DESC'; break;
      case 'appearances_desc': orderSql = 'v.appearances DESC'; break;
      case 'name_asc': orderSql = 'p.name ASC'; break;
      case 'name_desc': orderSql = 'p.name DESC'; break;
      case 'number_asc': orderSql = 'pr.shirt_number ASC'; break;
      default: orderSql = 'v.goals DESC, v.assists DESC'; break;
    }

    // Main query
    const dataSql = `
      SELECT 
        pr.id AS registration_id,
        pr.season_id,
        s.label AS season_label,
        pr.team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        t.crest_url AS team_crest,
        p.id AS player_id,
        p.name,
        p.nationality,
        p.date_of_birth,
        p.image_url,
        pr.shirt_number,
        pr.position,
        COALESCE(v.appearances, 0) AS appearances,
        COALESCE(v.starts, 0) AS starts,
        COALESCE(v.minutes, 0) AS minutes,
        COALESCE(v.goals, 0) AS goals,
        COALESCE(v.assists, 0) AS assists,
        COALESCE(v.yellow, 0) AS yellow,
        COALESCE(v.red, 0) AS red
      FROM player_registrations pr
      JOIN players p ON pr.player_id = p.id
      JOIN teams t ON pr.team_id = t.id
      JOIN seasons s ON pr.season_id = s.id
      LEFT JOIN v_player_season_totals v ON pr.id = v.registration_id
      ${whereSql}
      ORDER BY ${orderSql}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(dataSql, [...params, limit, offset]);
    return { players: rows, total };
  },

  async getPlayerById(playerId) {
    // 1. Player identity
    const [playerRows] = await pool.query('SELECT * FROM players WHERE id = ?', [playerId]);
    if (!playerRows || playerRows.length === 0) return null;
    const player = playerRows[0];

    // 2. Career Season History
    const [historyRows] = await pool.query(`
      SELECT 
        pr.id AS registration_id,
        pr.season_id,
        s.label AS season_label,
        s.start_year,
        pr.team_id,
        t.name AS team_name,
        t.short_name AS team_short_name,
        pr.shirt_number,
        pr.position,
        pr.joined_on,
        pr.left_on,
        COALESCE(v.appearances, 0) AS appearances,
        COALESCE(v.starts, 0) AS starts,
        COALESCE(v.minutes, 0) AS minutes,
        COALESCE(v.goals, 0) AS goals,
        COALESCE(v.assists, 0) AS assists,
        COALESCE(v.yellow, 0) AS yellow,
        COALESCE(v.red, 0) AS red
      FROM player_registrations pr
      JOIN seasons s ON pr.season_id = s.id
      JOIN teams t ON pr.team_id = t.id
      LEFT JOIN v_player_season_totals v ON pr.id = v.registration_id
      WHERE pr.player_id = ?
      ORDER BY s.start_year DESC
    `, [playerId]);

    // 3. Match Log (if match-level stats exist for this player)
    const [matchLogs] = await pool.query(`
      SELECT 
        m.id AS match_id,
        m.matchday,
        m.kickoff_utc,
        m.home_team_id,
        m.away_team_id,
        th.short_name AS home_name,
        ta.short_name AS away_name,
        m.home_score,
        m.away_score,
        pms.started,
        pms.minutes,
        pms.goals,
        pms.assists,
        pms.yellow,
        pms.red
      FROM player_match_stats pms
      JOIN player_registrations pr ON pms.registration_id = pr.id
      JOIN matches m ON pms.match_id = m.id
      JOIN teams th ON m.home_team_id = th.id
      JOIN teams ta ON m.away_team_id = ta.id
      WHERE pr.player_id = ?
      ORDER BY m.kickoff_utc DESC, m.matchday DESC
      LIMIT 20
    `, [playerId]);

    // 4. Career Aggregates
    const careerTotals = historyRows.reduce((acc, row) => ({
      appearances: acc.appearances + Number(row.appearances),
      starts: acc.starts + Number(row.starts),
      minutes: acc.minutes + Number(row.minutes),
      goals: acc.goals + Number(row.goals),
      assists: acc.assists + Number(row.assists),
      yellow: acc.yellow + Number(row.yellow),
      red: acc.red + Number(row.red),
    }), { appearances: 0, starts: 0, minutes: 0, goals: 0, assists: 0, yellow: 0, red: 0 });

    return {
      player,
      careerTotals,
      seasonHistory: historyRows,
      recentMatches: matchLogs,
    };
  },

  async getDistinctNationalities(seasonId = null, teamId = null) {
    let whereClauses = ['p.nationality IS NOT NULL'];
    let params = [];

    if (seasonId) {
      whereClauses.push('pr.season_id = ?');
      params.push(seasonId);
    }
    if (teamId) {
      whereClauses.push('pr.team_id = ?');
      params.push(teamId);
    }

    const [rows] = await pool.query(`
      SELECT DISTINCT p.nationality
      FROM player_registrations pr
      JOIN players p ON pr.player_id = p.id
      WHERE ${whereClauses.join(' AND ')}
      ORDER BY p.nationality ASC
    `, params);

    return rows.map(r => r.nationality);
  },
};
