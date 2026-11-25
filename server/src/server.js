import { app } from './app.js';
import { ENV } from './config/env.js';
import { testConnection } from './config/db.js';

const PORT = ENV.PORT || 5000;

const startServer = async () => {
  console.log(`[BOOT] Initializing FC Barcelona La Liga DBMS API Server...`);
  
  // Test MySQL connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.warn(`[WARNING] Database connection not ready yet. Server will start and retry connections on demand.`);
  }

  app.listen(PORT, () => {
    console.log(`[READY] Server running in ${ENV.NODE_ENV} mode on http://localhost:${PORT}`);
    console.log(`[READY] API Endpoints available at http://localhost:${PORT}/api`);
  });
};

startServer().catch(err => {
  console.error('[FATAL] Error starting server:', err);
  process.exit(1);
});
