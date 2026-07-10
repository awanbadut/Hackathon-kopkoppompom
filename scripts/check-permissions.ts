import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

function loadEnv() {
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

loadEnv();

const isSslEnabled = process.env.DB_SSL === 'true';

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : undefined,
});

async function main() {
  await client.connect();
  console.log('Connected! Checking schemas and privileges...');

  // 1. Check current database and user
  const { rows: currentInfo } = await client.query('SELECT current_database(), current_user');
  console.log('Current DB & User:', currentInfo[0]);

  // 2. Check schemas where we have CREATE privilege
  const { rows: schemas } = await client.query(`
    SELECT nspname FROM pg_namespace 
    WHERE has_schema_privilege(current_user, nspname, 'CREATE')
  `);
  console.log('Schemas with CREATE privilege:', schemas.map(s => s.nspname));

  // 3. List all schemas
  const { rows: allSchemas } = await client.query('SELECT schema_name FROM information_schema.schemata');
  console.log('All schemas in database:', allSchemas.map(s => s.schema_name));

  await client.end();
}

main().catch(async err => {
  console.error('Failed checking permissions:', err);
  try {
    await client.end();
  } catch (e) {}
  process.exit(1);
});
