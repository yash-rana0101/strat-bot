import postgres from 'postgres';
import { logger } from '../utils/logger.js';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  logger.warn('DATABASE_URL is missing in environment variables. Database operations will fail.');
}

export const sql = postgres(connectionString || 'postgres://placeholder', {
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export function closeDatabase(): void {
  sql.end().catch((err) => {
    logger.error('Failed to close database connection:', err);
  });
}
