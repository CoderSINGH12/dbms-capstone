import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 3306,
    USER: process.env.DB_USER || 'fcb_user',
    PASS: process.env.DB_PASS || 'fcb123',
    NAME: process.env.DB_NAME || 'fcb_laliga_db',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'fcb_dev_secret_fallback_key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  FOOTBALL_DATA_TOKEN: process.env.FOOTBALL_DATA_API_TOKEN || '',
};
