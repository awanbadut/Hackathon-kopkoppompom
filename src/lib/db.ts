import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually if running in a script / offline test runner environment
if (!process.env.DB_HOST) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

const isSslEnabled = process.env.DB_SSL === 'true';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : undefined,
});

export const db = {
  query: async (text: string, params?: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DB Query]: ${text} | Params: ${JSON.stringify(params)}`);
    }
    return pool.query(text, params);
  },
  pool,
};

export function p(tableName: string): string {
  const prefix = process.env.DB_PREFIX || '';
  return `${prefix}${tableName}`;
}
