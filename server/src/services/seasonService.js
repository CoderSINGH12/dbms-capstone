import { pool } from '../config/db.js';

export const seasonService = {
  async getAllSeasons() {
    const [rows] = await pool.query(`
      SELECT 
        s.id, 
        s.label, 
        s.start_year, 
        s.end_year, 
        s.status, 
        s.coverage, 
        c.name AS competition_name,
        (SELECT COUNT(*) FROM season_teams WHERE season_id = s.id) AS team_count,
        (SELECT COUNT(*) FROM matches WHERE season_id = s.id AND status = 'finished') AS finished_matches_count
      FROM seasons s
      JOIN competitions c ON s.competition_id = c.id
      ORDER BY s.start_year DESC
    `);
    return rows;
  },

  async getSeasonById(id) {
    const [rows] = await pool.query(`
      SELECT s.*, c.name AS competition_name
      FROM seasons s
      JOIN competitions c ON s.competition_id = c.id
      WHERE s.id = ?
    `, [id]);
    return rows[0] || null;
  },
};
