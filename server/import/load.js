import { pool } from '../src/config/db.js';

export const loadMatches = async (matches) => {
  let loaded = 0;
  for (const m of matches) {
    await pool.query(`
      INSERT INTO matches 
        (season_id, matchday, home_team_id, away_team_id, kickoff_utc, status, home_score, away_score, venue, referee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        home_score = VALUES(home_score),
        away_score = VALUES(away_score),
        status = VALUES(status),
        kickoff_utc = VALUES(kickoff_utc)
    `, [
      m.season_id, m.matchday, m.home_team_id, m.away_team_id,
      m.kickoff_utc, m.status, m.home_score, m.away_score, m.venue, m.referee
    ]);
    loaded++;
  }
  return loaded;
};

export const loadPlayerStats = async (statsList) => {
  let loaded = 0;
  for (const s of statsList) {
    await pool.query(`
      INSERT INTO player_match_stats
        (match_id, registration_id, started, minutes, goals, assists, yellow, red)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        minutes = VALUES(minutes),
        goals = VALUES(goals),
        assists = VALUES(assists),
        yellow = VALUES(yellow),
        red = VALUES(red)
    `, [
      s.match_id, s.registration_id, s.started, s.minutes, s.goals, s.assists, s.yellow, s.red
    ]);
    loaded++;
  }
  return loaded;
};
