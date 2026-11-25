import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { ENV } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../');
const dbDir = path.resolve(projectRoot, 'database');

async function executeSqlFile(connection, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Strip DELIMITER statements for mysql2 compatibility
  const cleaned = content.replace(/DELIMITER\s+\$\$/g, '').replace(/DELIMITER\s+;/g, '').replace(/\$\$/g, ';');
  
  // Split statements by semicolon while ignoring comments
  const statements = cleaned
    .split(/;\s*[\r\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await connection.query(statement);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`[Warning in ${path.basename(filePath)}]:`, err.message);
        }
      }
    }
  }
}

async function runInit() {
  console.log('================================================================');
  console.log('  FC Barcelona La Liga DBMS - Database Initializer & Seeder     ');
  console.log('================================================================');

  let connection;
  try {
    // Connect without database first to ensure database exists
    connection = await mysql.createConnection({
      host: ENV.DB.HOST,
      port: ENV.DB.PORT,
      user: ENV.DB.USER,
      password: ENV.DB.PASS,
      multipleStatements: true,
    });

    console.log('[1/7] Creating database and selecting schema...');
    await executeSqlFile(connection, path.join(dbDir, 'schema', '01_create_database.sql'));
    await connection.query(`USE ${ENV.DB.NAME};`);

    console.log('[2/7] Creating relational tables and CHECK constraints...');
    await executeSqlFile(connection, path.join(dbDir, 'schema', '02_tables.sql'));

    console.log('[3/7] Creating performance indexes...');
    await executeSqlFile(connection, path.join(dbDir, 'schema', '03_indexes.sql'));

    console.log('[4/7] Creating computed views (v_standings, player totals, summaries)...');
    await executeSqlFile(connection, path.join(dbDir, 'schema', '04_views.sql'));

    console.log('[5/7] Creating complex integrity triggers...');
    await executeSqlFile(connection, path.join(dbDir, 'schema', '05_triggers.sql'));

    console.log('[6/7] Seeding competitions, teams, registrations, matches, and stats...');
    await executeSqlFile(connection, path.join(dbDir, 'seed', '10_competitions_seasons.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '11_teams.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '12_season_teams.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '13_players_registrations.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '14_matches.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '15_stats.sql'));
    await executeSqlFile(connection, path.join(dbDir, 'seed', '16_final_standings.sql'));

    console.log('[7/7] Seeding administrative credentials...');
    await executeSqlFile(connection, path.join(dbDir, 'seed', '17_admin_user.sql'));

    console.log('================================================================');
    console.log('  SUCCESS: Database initialized and seeded with full coverage!  ');
    console.log('================================================================');
  } catch (error) {
    console.error('[Error during database initialization]:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Hint: Please run "database/setup_user.sql" in MySQL Workbench to create fcb_user.');
    }
  } finally {
    if (connection) await connection.end();
  }
}

runInit();
