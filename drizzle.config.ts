import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

function normalizeConnectionString(raw?: string): string {
  if (!raw) throw new Error('Missing database URL in env');
  const match = raw.match(/^psql\s+'(.+)'$/);
  return match ? match[1] : raw;
}

const url = normalizeConnectionString(
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL
);

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
});
