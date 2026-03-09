import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "edge";

export async function GET(request: Request) {
  // Optional: protect with a secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { error: "Missing DATABASE_URL" },
      { status: 500 }
    );
  }

  // Fetch pools from Mezo API
  const res = await fetch("https://api.mezo.org/pools", {
    headers: {
      Origin: "https://mezo.org",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Mezo API" },
      { status: 502 }
    );
  }

  const json = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    return NextResponse.json(
      { error: "Unexpected API response" },
      { status: 502 }
    );
  }

  const sql = neon(databaseUrl);
  let snapshotted = 0;

  for (const pool of json.data) {
    const tvl = parseFloat(pool.tvl);
    const dailyFeesUsd = pool.stats.fees.reduce(
      (sum: number, f: { amountUSD: string }) => sum + parseFloat(f.amountUSD),
      0
    );
    const dailyVolumeUsd = pool.stats.volume.reduce(
      (sum: number, v: { amountUSD: string }) => sum + parseFloat(v.amountUSD),
      0
    );
    const feeApr = tvl > 0 ? (dailyFeesUsd / tvl) * 365 * 100 : 0;
    const totalApr = pool.stats.apr / 100;

    await sql.query(
      `INSERT INTO pool_snapshots (pool_address, tvl, fee_apr, total_apr, daily_fees_usd, daily_volume_usd)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (pool_address, snapshot_date) DO UPDATE
         SET tvl = EXCLUDED.tvl,
             fee_apr = EXCLUDED.fee_apr,
             total_apr = EXCLUDED.total_apr,
             daily_fees_usd = EXCLUDED.daily_fees_usd,
             daily_volume_usd = EXCLUDED.daily_volume_usd`,
      [pool.address, tvl, feeApr, totalApr, dailyFeesUsd, dailyVolumeUsd]
    );
    snapshotted++;
  }

  return NextResponse.json({
    success: true,
    snapshotted,
    timestamp: new Date().toISOString(),
  });
}
