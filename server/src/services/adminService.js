import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const adminService = {
  async getDatabaseStats() {
    const [teams] = await pool.query('SELECT COUNT(*) AS count FROM teams');
    const [players] = await pool.query('SELECT COUNT(*) AS count FROM players');
    const [registrations] = await pool.query('SELECT COUNT(*) AS count FROM player_registrations');
    const [matches] = await pool.query('SELECT COUNT(*) AS count FROM matches');
    const [seasons] = await pool.query('SELECT COUNT(*) AS count FROM seasons');
    const [stats] = await pool.query('SELECT COUNT(*) AS count FROM player_match_stats');
    const [batches] = await pool.query('SELECT * FROM import_batches ORDER BY created_at DESC LIMIT 5');

    return {
      teamsCount: teams[0].count,
      playersCount: players[0].count,
      registrationsCount: registrations[0].count,
      matchesCount: matches[0].count,
      seasonsCount: seasons[0].count,
      matchStatsCount: stats[0].count,
      recentBatches: batches,
    };
  },

  // TEAMS CRUD
  async createTeam(data) {
    const [res] = await pool.query(`
      INSERT INTO teams (name, short_name, tla, crest_url, city, stadium, founded_year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.name, data.short_name, data.tla, data.crest_url, data.city, data.stadium, data.founded_year]);
    return { id: res.insertId, ...data };
  },

  async updateTeam(id, data) {
    const fields = [];
    const values = [];
    Object.keys(data).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    });
    values.push(id);
    await pool.query(`UPDATE teams SET ${fields.join(', ')} WHERE id = ?`, values);
    return { id, ...data };
  },

  async deleteTeam(id) {
    await pool.query('DELETE FROM teams WHERE id = ?', [id]);
    return { success: true, id };
  },

  // PLAYERS CRUD
  async createPlayer(data) {
    const [res] = await pool.query(`
      INSERT INTO players (name, date_of_birth, nationality, image_url)
      VALUES (?, ?, ?, ?)
    `, [data.name, data.date_of_birth, data.nationality, data.image_url]);
    return { id: res.insertId, ...data };
  },

  async updatePlayer(id, data) {
    const fields = [];
    const values = [];
    Object.keys(data).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    });
    values.push(id);
    await pool.query(`UPDATE players SET ${fields.join(', ')} WHERE id = ?`, values);
    return { id, ...data };
  },

  async deletePlayer(id) {
    await pool.query('DELETE FROM players WHERE id = ?', [id]);
    return { success: true, id };
  },

  // REGISTRATIONS CRUD
  async createRegistration(data) {
    const [res] = await pool.query(`
      INSERT INTO player_registrations (player_id, team_id, season_id, shirt_number, position, joined_on, left_on)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.player_id, data.team_id, data.season_id, data.shirt_number, data.position, data.joined_on, data.left_on]);
    return { id: res.insertId, ...data };
  },

  async deleteRegistration(id) {
    await pool.query('DELETE FROM player_registrations WHERE id = ?', [id]);
    return { success: true, id };
  },

  // MATCHES CRUD
  async createMatch(data) {
    const [res] = await pool.query(`
      INSERT INTO matches (season_id, matchday, home_team_id, away_team_id, kickoff_utc, status, home_score, away_score, venue, referee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.season_id, data.matchday, data.home_team_id, data.away_team_id,
      data.kickoff_utc || null, data.status || 'scheduled',
      data.home_score !== undefined ? data.home_score : null,
      data.away_score !== undefined ? data.away_score : null,
      data.venue || null, data.referee || null,
    ]);
    return { id: res.insertId, ...data };
  },

  async updateMatch(id, data) {
    const fields = [];
    const values = [];
    Object.keys(data).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    });
    values.push(id);
    await pool.query(`UPDATE matches SET ${fields.join(', ')} WHERE id = ?`, values);
    return { id, ...data };
  },

  async deleteMatch(id) {
    await pool.query('DELETE FROM matches WHERE id = ?', [id]);
    return { success: true, id };
  },

  // IMPORT LOGS & BATCHES
  async getImportBatches() {
    const [rows] = await pool.query(`
      SELECT 
        ib.*,
        ds.name AS source_name,
        s.label AS season_label
      FROM import_batches ib
      JOIN data_sources ds ON ib.source_id = ds.id
      LEFT JOIN seasons s ON ib.season_id = s.id
      ORDER BY ib.created_at DESC
      LIMIT 20
    `);
    return rows;
  },

  async createImportBatch({ source_id, season_id, batch_name, records_processed, records_rejected, log_summary, status }) {
    const [res] = await pool.query(`
      INSERT INTO import_batches 
        (source_id, season_id, batch_name, records_processed, records_rejected, log_summary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [source_id, season_id, batch_name, records_processed, records_rejected, log_summary, status]);
    return { id: res.insertId };
  },
};
