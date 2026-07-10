import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { evaluateTransactionRisk } from '../src/lib/risk-scanner';

// Load env
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

const prefix = process.env.DB_PREFIX || '';
function p(tableName: string): string {
  return `${prefix}${tableName}`;
}

const isSslEnabled = process.env.DB_SSL === 'true';

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: isSslEnabled ? { rejectUnauthorized: false } : undefined,
  });

  console.log('Menghubungkan ke database...');
  await client.connect();

  console.log('Membuat transaksi simulasi yang melanggar aturan PMK 7/2026...');
  
  // Insert transaction: Dana Desa used for Operasional category (R02 violation)
  const { rows } = await client.query(`
    INSERT INTO ${p('transaksi_keuangan')} 
    (koperasi_ref, type, sumber_dana, kategori, amount, description, input_by, status, risk_level, transaction_date)
    VALUES (
      'KOP-539EF09CDAAD', 
      'pengeluaran', 
      'dana_desa', 
      'operasional', 
      4500000, 
      'Simulasi Pelanggaran: Membeli Printer Kantor menggunakan Dana Desa', 
      'd142d765-bcf7-4f0e-b7d1-127e7d69e802', 
      'disetujui', 
      'aman', 
      CURRENT_DATE
    )
    RETURNING id
  `);

  const txId = rows[0].id;
  console.log(`✓ Transaksi berhasil dimasukkan dengan ID: ${txId}`);

  console.log('Menjalankan Risk Scanner untuk transaksi ini...');
  const riskResult = await evaluateTransactionRisk(txId);

  console.log('\n--- HASIL EVALUASI RISIKO ---');
  console.log(`Risk Level: ${riskResult.finalRiskLevel.toUpperCase()}`);
  console.log('Aturan yang Dilanggar:');
  riskResult.triggeredRules.forEach(rule => {
    console.log(`- [${rule.rule_code}] ${rule.message}`);
  });

  // Check updated Health Score
  const { rows: healthCheck } = await client.query(
    `SELECT health_score FROM ${p('v_compliance_summary')} WHERE koperasi_ref = 'KOP-539EF09CDAAD'`
  );
  
  console.log(`\n✓ SKOR KEPATUHAN KOPERASI SEKARANG: ${healthCheck[0]?.health_score ?? 100}%`);
  console.log('Buka dashboard Anda di browser dan muat ulang halaman untuk melihat skor berkurang!');

  await client.end();
}

main().catch(err => {
  console.error('Gagal membuat pelanggaran:', err);
  process.exit(1);
});
