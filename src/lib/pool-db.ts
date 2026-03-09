import { neon } from "@neondatabase/serverless";

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL");
  }
  return neon(databaseUrl);
}

// -- Pool history from snapshots --

export interface PoolSnapshot {
  date: string;
  tvl: number;
  feeApr: number;
  totalApr: number;
}

export async function getPoolHistory(
  poolAddress: string,
  days = 30
): Promise<PoolSnapshot[]> {
  const sql = getSql();
  const rows = await sql.query(
    `SELECT
       snapshot_date::text as date,
       tvl::float as tvl,
       fee_apr::float as fee_apr,
       total_apr::float as total_apr
     FROM pool_snapshots
     WHERE pool_address = $1
       AND snapshot_date >= CURRENT_DATE - ($2::int)
     ORDER BY snapshot_date ASC`,
    [poolAddress, days]
  );

  return (rows as { date: string; tvl: number; fee_apr: number; total_apr: number }[]).map((r) => ({
    date: r.date,
    tvl: r.tvl,
    feeApr: r.fee_apr,
    totalApr: r.total_apr,
  }));
}

// -- Pool rewards (Merkl / external incentives) --

export interface PoolReward {
  tokenSymbol: string;
  dailyUsd: number;
}

export async function getPoolRewards(
  poolAddress: string
): Promise<PoolReward[]> {
  const sql = getSql();
  const rows = await sql.query(
    `SELECT token_symbol, daily_usd::float as daily_usd
     FROM pool_rewards
     WHERE pool_address = $1 AND active = true
     ORDER BY daily_usd DESC`,
    [poolAddress]
  );

  return (rows as { token_symbol: string; daily_usd: number }[]).map((r) => ({
    tokenSymbol: r.token_symbol,
    dailyUsd: r.daily_usd,
  }));
}

export async function getAllPoolRewards(): Promise<
  Record<string, PoolReward[]>
> {
  const sql = getSql();
  const rows = await sql.query(
    `SELECT pool_address, token_symbol, daily_usd::float as daily_usd
     FROM pool_rewards
     WHERE active = true
     ORDER BY pool_address, daily_usd DESC`
  );

  const result: Record<string, PoolReward[]> = {};
  for (const r of rows as {
    pool_address: string;
    token_symbol: string;
    daily_usd: number;
  }[]) {
    if (!result[r.pool_address]) {
      result[r.pool_address] = [];
    }
    result[r.pool_address].push({
      tokenSymbol: r.token_symbol,
      dailyUsd: r.daily_usd,
    });
  }
  return result;
}

export async function getAllPoolHistory(
  days = 30
): Promise<Record<string, PoolSnapshot[]>> {
  const sql = getSql();
  const rows = await sql.query(
    `SELECT
       pool_address,
       snapshot_date::text as date,
       tvl::float as tvl,
       fee_apr::float as fee_apr,
       total_apr::float as total_apr
     FROM pool_snapshots
     WHERE snapshot_date >= CURRENT_DATE - ($1::int)
     ORDER BY pool_address, snapshot_date ASC`,
    [days]
  );

  const result: Record<string, PoolSnapshot[]> = {};
  for (const r of rows as {
    pool_address: string;
    date: string;
    tvl: number;
    fee_apr: number;
    total_apr: number;
  }[]) {
    if (!result[r.pool_address]) {
      result[r.pool_address] = [];
    }
    result[r.pool_address].push({
      date: r.date,
      tvl: r.tvl,
      feeApr: r.fee_apr,
      totalApr: r.total_apr,
    });
  }
  return result;
}
