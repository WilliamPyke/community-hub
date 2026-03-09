import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const envFileUrl = new URL("../.env.local", import.meta.url);
    const envFile = await readFile(envFileUrl, "utf8");
    const match = envFile.match(/^DATABASE_URL=(?:"([^"]+)"|(.+))$/m);

    if (match) {
      return match[1] ?? match[2];
    }
  } catch {
    // Ignore missing local env file
  }

  return undefined;
}

const databaseUrl = await getDatabaseUrl();

if (!databaseUrl) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(databaseUrl);

const statements = [
  `DROP TABLE IF EXISTS pool_snapshots`,
  `DROP TABLE IF EXISTS pool_rewards`,
  `CREATE TABLE pool_snapshots (
    id SERIAL PRIMARY KEY,
    pool_address TEXT NOT NULL,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tvl NUMERIC NOT NULL,
    fee_apr NUMERIC NOT NULL,
    total_apr NUMERIC NOT NULL,
    daily_fees_usd NUMERIC NOT NULL,
    daily_volume_usd NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pool_address, snapshot_date)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_pool_snapshots_address_date ON pool_snapshots (pool_address, snapshot_date DESC)`,
  `CREATE TABLE pool_rewards (
    id SERIAL PRIMARY KEY,
    pool_address TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    daily_usd NUMERIC NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (pool_address, token_symbol)
  )`,
  `INSERT INTO pool_rewards (pool_address, token_symbol, daily_usd)
   VALUES
     ('0x52e604c44417233b6CcEDDDc0d640A405Caacefb', 'MUSD', 300),
     ('0x52e604c44417233b6CcEDDDc0d640A405Caacefb', 'BTC', 150)
   ON CONFLICT (pool_address, token_symbol) DO UPDATE
     SET daily_usd = EXCLUDED.daily_usd, updated_at = NOW()`,
];

for (const stmt of statements) {
  await sql.query(stmt);
}

console.log("Created pool_snapshots and pool_rewards tables.");
console.log("Seeded example rewards for vAMM-BTC/MUSD.");
