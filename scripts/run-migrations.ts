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
  console.log(`Connecting to database at ${process.env.DB_HOST}...`);
  await client.connect();
  console.log('Connected! Starting database migration...');

  const migrationFiles = [
    'supabase/migrations/0001_reference_schema.sql',
    'supabase/migrations/0002_amandes_additive.sql',
    'supabase/migrations/0003_rls_and_triggers.sql',
    'supabase/migrations/0004_amandes_community.sql',
    'supabase/migrations/0005_weekly_missions.sql',
    'supabase/migrations/0006_savings_points_trigger.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.resolve(process.cwd(), file);
    console.log(`Running migration: ${file}...`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await client.query(sql);
      console.log(`✓ Migration ${file} completed successfully.`);
    } catch (err: any) {
      if (err.code === '42P07' || err.message.includes('already exists')) {
        console.log(`⚠ Migration ${file} warning: relation already exists, continuing.`);
        continue;
      }
      console.error(`✗ Error in migration ${file}:`, err.message);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log('All migrations executed successfully on the shared database!');
}

main().catch(async err => {
  console.error('Migration failed:', err);
  try {
    await client.end();
  } catch (e) {}
  process.exit(1);
});
