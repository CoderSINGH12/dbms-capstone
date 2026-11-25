import mysql from 'mysql2/promise';
import { ENV } from './env.js';

export const pool = mysql.createPool({
  host: ENV.DB.HOST,
  port: ENV.DB.PORT,
  user: ENV.DB.USER,
  password: ENV.DB.PASS,
  database: ENV.DB.NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  decimalNumbers: true,
  dateStrings: true,
});

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() AS version, DATABASE() AS current_db');
    connection.release();
    console.log(`[DB] Connected successfully to MySQL (${rows[0].version}) on database: ${rows[0].current_db}`);
    return true;
  } catch (error) {
    console.error(`[DB Error] Unable to connect to MySQL database '${ENV.DB.NAME}' on ${ENV.DB.HOST}:${ENV.DB.PORT}:`, error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`[DB Setup Hint] Ensure user '${ENV.DB.USER}' is created. Run 'database/setup_user.sql' in MySQL Workbench.`);
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`[DB Setup Hint] Database '${ENV.DB.NAME}' does not exist yet. Run 'database/reset.bat' or npm run db:init.`);
    }
    return false;
  }
};
