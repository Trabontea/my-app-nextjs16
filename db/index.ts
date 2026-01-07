import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

function normalizeConnectionString(raw?: string): string | undefined {
  if (!raw) return undefined;
  // Support values like: DATABASE_URL=psql 'postgresql://...'
  const match = raw.match(/^psql\s+'(.+)'$/);
  return match ? match[1] : raw;
}

const envUrl = normalizeConnectionString(
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL
);
if (!envUrl) {
  throw new Error('NEON_DATABASE_URL or DATABASE_URL is not set');
}

const sql = neon(envUrl);
export const db = drizzle(sql);

export async function healthCheck(): Promise<boolean> {
  const rows = await sql`select 1 as up`;
  return Array.isArray(rows) && rows[0]?.up === 1;
}
