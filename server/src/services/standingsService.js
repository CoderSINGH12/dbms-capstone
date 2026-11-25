import { pool } from '../config/db.js';

export const standingsService = {
  async getStandings(seasonId) {
    const [rows] = await pool.query(`
      SELECT 
        v.position,
        v.team_id,
        v.team_name,
        v.short_name,
        v.tla,
        v.crest_url,
        v.played,
        v.won,
        v.drawn,
        v.lost,
        v.gf,
        v.ga,
        v.gd,
        v.points
      FROM v_standings v
      WHERE v.season_id = ?
      ORDER BY v.position ASC
    `, [seasonId]);

    // Attach form guide for each team (last 5 finished matches in this season)
    for (const team of rows) {
      const [formRows] = await pool.query(`
        SELECT 
          CASE 
            WHEN (m.home_team_id = ? AND m.home_score > m.away_score) OR (m.away_team_id = ? AND m.away_score > m.home_score) THEN 'W'
            WHEN m.home_score = m.away_score THEN 'D'
            ELSE 'L'
          END AS result
        FROM matches m
        WHERE m.season_id = ? AND (m.home_team_id = ? OR m.away_team_id = ?) AND m.status = 'finished'
        ORDER BY m.matchday DESC
        LIMIT 5
      `, [team.team_id, team.team_id, seasonId, team.team_id, team.team_id]);
      
      team.form = formRows.map(f => f.result).reverse();
    }

    return rows;
  },

  async reconcileStandings(seasonId) {
    const [rows] = await pool.query(`
      SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.short_name,
        t.crest_url,
        comp.position AS computed_position,
        comp.played AS computed_played,
        comp.won AS computed_won,
        comp.drawn AS computed_drawn,
        comp.lost AS computed_lost,
        comp.gf AS computed_gf,
        comp.ga AS computed_ga,
        comp.points AS computed_points,
        off.position AS official_position,
        off.played AS official_played,
        off.won AS official_won,
        off.drawn AS official_drawn,
        off.lost AS official_lost,
        off.gf AS official_gf,
        off.ga AS official_ga,
        off.points AS official_points,
        (comp.points - COALESCE(off.points, 0)) AS points_difference,
        (comp.position - COALESCE(off.position, 0)) AS position_difference,
        CASE 
          WHEN off.team_id IS NULL THEN 'NO_OFFICIAL_RECORD'
          WHEN comp.points = off.points AND comp.position = off.position THEN 'EXACT_MATCH'
          ELSE 'DISCREPANCY'
        END AS reconciliation_status
      FROM v_standings comp
      LEFT JOIN final_standings off ON comp.season_id = off.season_id AND comp.team_id = off.team_id
      JOIN teams t ON comp.team_id = t.id
      WHERE comp.season_id = ?
      ORDER BY comp.position ASC
    `, [seasonId]);

    const totalAudited = rows.length;
    const exactMatches = rows.filter(r => r.reconciliation_status === 'EXACT_MATCH').length;
    const discrepancies = rows.filter(r => r.reconciliation_status === 'DISCREPANCY').length;
    const missingOfficial = rows.filter(r => r.reconciliation_status === 'NO_OFFICIAL_RECORD').length;

    return {
      seasonId,
      summary: {
        totalAudited,
        exactMatches,
        discrepancies,
        missingOfficial,
        status: discrepancies === 0 ? 'VERIFIED' : 'DISCREPANCIES_DETECTED',
      },
      auditRecords: rows,
    };
  },
};
