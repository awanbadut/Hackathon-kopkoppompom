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
  console.log('Connected! Checking database CREATE privilege...');
  
  const { rows: dbPriv } = await client.query(`
    SELECT has_database_privilege(current_user, current_database(), 'CREATE') as has_create_priv
  `);
  console.log('Has database CREATE privilege:', dbPriv[0].has_create_priv);

  try {
    console.log('Attempting to CREATE SCHEMA kopkoppompom...');
    await client.query('CREATE SCHEMA IF NOT EXISTS kopkoppompom');
    console.log('✓ Success! Schema kopkoppompom created or already exists.');
    
    // Clean it up just in case or keep it
    console.log('Attempting to create a test table inside kopkoppompom...');
    await client.query('CREATE TABLE IF NOT EXISTS kopkoppompom.test_table (id serial primary key, val text)');
    console.log('✓ Success! Table created inside kopkoppompom schema.');

    // Drop test table
    await client.query('DROP TABLE kopkoppompom.test_table');
    console.log('✓ Test table cleaned up.');
  } catch (err: any) {
    console.error('✗ Failed schema/table creation:', err.message);
  }

  await client.end();
}

main().catch(async err => {
  console.error('Script failed:', err);
  try {
    await client.end();
  } catch (e) {}
  process.exit(1);
});
