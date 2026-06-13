import { sql } from '../database/connection.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { logger } from '../utils/logger.js';

async function initDb() {
  try {
    logger.info('Initializing Supabase Database...');
    const schemaPath = resolve('supabase_schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    // Run the schema queries
    await sql.unsafe(schemaSql);

    logger.info('Supabase Database tables and indexes created successfully!');
    process.exit(0);
  } catch (err: any) {
    logger.error('Failed to initialize Supabase Database:', err);
    process.exit(1);
  }
}

initDb();
