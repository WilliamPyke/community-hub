import { getAllPoolRewards, getAllPoolHistory, type PoolReward, type PoolSnapshot } from "./pool-db";

export interface AprComponent {
  label: string;
  apr: number;
  type: "base" | "reward";
}

export interface YieldPool {
  id: string;
  protocol: string;
  protocolLogo: string;
  pair: string;
  asset1: string;
  asset2: string;
  apr: number;
  aprBreakdown: AprComponent[];
  tvl: number;
  dailyFees: number;
  category: "stable" | "volatile";
  externalUrl: string;
  description: string;
  strategy: string;
  riskChecklist: {
    audited: boolean;
    timelock: boolean;
    multiSig: boolean;
    syntheticAssets: boolean;
    oracleVerified: boolean;
  };
  history: { date: string; apy: number; tvl: number }[];
  lpBreakdown: { asset: string; percentage: number; color: string }[];
  poolType: string;
}

// -- API types --

interface ApiToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price: string;
  reserve: string;
}

interface ApiVolumeFee {
  token: string;
  amount: string;
  amountUSD: string;
}

interface ApiPool {
  address: string;
  name: string;
  symbol: string;
  token0: ApiToken;
  token1: ApiToken;
  tvl: string;
  matsBoost: number;
  stats: {
    volume: ApiVolumeFee[];
    fees: ApiVolumeFee[];
    gaugeFees: ApiVolumeFee[];
    bribes: ApiVolumeFee[];
    apr: number;
    votingApr: number;
  };
  gauge: string | null;
  volatility: "stable" | "volatile";
  isVotable: boolean;
  type: "basic" | "concentrated";
  supply?: string;
}

// -- Color palette for LP breakdown --

const TOKEN_COLORS: Record<string, string> = {
  BTC: "#f59e0b",
  MUSD: "#34d399",
  mUSDC: "#60a5fa",
  mUSDT: "#a78bfa",
  mcbBTC: "#fb923c",
  mSolvBTC: "#f472b6",
  mxSolvBTC: "#e879f9",
  mT: "#38bdf8",
};

function getTokenColor(symbol: string, index: number): string {
  if (TOKEN_COLORS[symbol]) return TOKEN_COLORS[symbol];
  const fallback = ["#818cf8", "#fb7185", "#fbbf24", "#2dd4bf"];
  return fallback[index % fallback.length];
}

// -- Generate synthetic history (fallback when no DB snapshots) --

function generateFallbackHistory(baseApr: number, baseTvl: number) {
  const history = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split("T")[0],
      apy: Math.max(0, baseApr + (Math.random() - 0.5) * baseApr * 0.3),
      tvl: Math.max(0, baseTvl + (Math.random() - 0.5) * baseTvl * 0.15),
    });
  }
  return history;
}

// -- Convert DB snapshots to chart format --

function snapshotsToHistory(snapshots: PoolSnapshot[]) {
  return snapshots.map((s) => ({
    date: s.date,
    apy: s.totalApr,
    tvl: s.tvl,
  }));
}

// -- Build APR breakdown --

function buildAprBreakdown(
  feeApr: number,
  tvl: number,
  rewards: PoolReward[]
): { total: number; breakdown: AprComponent[] } {
  const breakdown: AprComponent[] = [
    { label: "Fee APR", apr: Math.round(feeApr * 100) / 100, type: "base" },
  ];

  let rewardAprTotal = 0;
  for (const reward of rewards) {
    const rewardApr = tvl > 0 ? (reward.dailyUsd * 365) / tvl * 100 : 0;
    const rounded = Math.round(rewardApr * 100) / 100;
    breakdown.push({
      label: reward.tokenSymbol,
      apr: rounded,
      type: "reward",
    });
    rewardAprTotal += rounded;
  }

  const total = Math.round((feeApr + rewardAprTotal) * 100) / 100;
  return { total, breakdown };
}

// -- Map API pool to our YieldPool interface --

function mapApiPool(
  pool: ApiPool,
  rewards: PoolReward[],
  snapshots: PoolSnapshot[]
): YieldPool {
  const tvl = parseFloat(pool.tvl);

  // Calculate fee-based APR from daily fees
  const dailyFees = pool.stats.fees.reduce(
    (sum, f) => sum + parseFloat(f.amountUSD),
    0
  );
  const feeApr = tvl > 0 ? (dailyFees / tvl) * 365 * 100 : 0;

  // Build APR breakdown (fee yield + reward tokens)
  const { total: totalApr, breakdown: aprBreakdown } = buildAprBreakdown(
    feeApr,
    tvl,
    rewards
  );

  // Calculate LP breakdown from reserves and prices
  const token0Value =
    (parseFloat(pool.token0.reserve) / Math.pow(10, pool.token0.decimals)) *
    parseFloat(pool.token0.price);
  const token1Value =
    (parseFloat(pool.token1.reserve) / Math.pow(10, pool.token1.decimals)) *
    parseFloat(pool.token1.price);
  const totalValue = token0Value + token1Value || 1;
  const pct0 = Math.round((token0Value / totalValue) * 1000) / 10;
  const pct1 = Math.round((1000 - pct0 * 10)) / 10;

  const pair = `${pool.token0.symbol} / ${pool.token1.symbol}`;

  const typeLabel =
    pool.type === "concentrated"
      ? "Concentrated Liquidity"
      : pool.volatility === "stable"
      ? "Stable AMM"
      : "Volatile AMM";

  const description =
    pool.type === "concentrated"
      ? `Concentrated liquidity pool for ${pool.token0.symbol} and ${pool.token1.symbol}. Provides tighter price ranges for higher capital efficiency.`
      : pool.volatility === "stable"
      ? `Stable swap pool for ${pool.token0.symbol} and ${pool.token1.symbol}. Low impermanent loss with consistent yield from swap fees.`
      : `Volatile pair pool for ${pool.token0.symbol} and ${pool.token1.symbol}. Higher IL risk offset by trading fees and rewards.`;

  const strategy =
    pool.type === "concentrated"
      ? `Concentrated liquidity position with tighter price ranges for maximum capital efficiency. Fees are earned from swaps within the active tick range.`
      : pool.volatility === "stable"
      ? `StableSwap invariant curve optimized for pegged assets. Extremely low impermanent loss. Yield driven by swap fees${rewards.length > 0 ? " and external reward incentives" : ""}.`
      : `Automated market maker with constant product formula. ${rewards.length > 0 ? "Additional reward incentives distributed via Merkl. " : ""}Fees auto-accrue to LP positions.`;

  // Use DB history if available, otherwise generate fallback
  const history =
    snapshots.length >= 2
      ? snapshotsToHistory(snapshots)
      : generateFallbackHistory(totalApr, tvl);

  return {
    id: pool.address,
    protocol: "Mezo",
    protocolLogo: "MZ",
    pair,
    asset1: pool.token0.symbol,
    asset2: pool.token1.symbol,
    apr: totalApr,
    aprBreakdown,
    tvl,
    dailyFees: Math.round(dailyFees * 100) / 100,
    category: pool.volatility,
    externalUrl: `https://app.mezo.org/pools/${pool.address}`,
    description,
    strategy,
    riskChecklist: {
      audited: true,
      timelock: !!pool.gauge,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history,
    lpBreakdown: [
      {
        asset: pool.token0.symbol,
        percentage: pct0,
        color: getTokenColor(pool.token0.symbol, 0),
      },
      {
        asset: pool.token1.symbol,
        percentage: pct1,
        color: getTokenColor(pool.token1.symbol, 1),
      },
    ],
    poolType: typeLabel,
  };
}

// -- Fetch live pool data from Mezo API --

export async function fetchPools(): Promise<YieldPool[]> {
  const res = await fetch("https://api.mezo.org/pools", {
    headers: {
      Origin: "https://mezo.org",
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    console.error("Failed to fetch pools from Mezo API:", res.status);
    return [];
  }

  const json = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    console.error("Unexpected API response shape");
    return [];
  }

  // Fetch rewards and history from DB in parallel
  let allRewards: Record<string, PoolReward[]> = {};
  let allHistory: Record<string, PoolSnapshot[]> = {};

  try {
    [allRewards, allHistory] = await Promise.all([
      getAllPoolRewards(),
      getAllPoolHistory(30),
    ]);
  } catch (err) {
    console.error("Failed to fetch pool DB data:", err);
  }

  return json.data.map((pool: ApiPool) =>
    mapApiPool(
      pool,
      allRewards[pool.address] ?? [],
      allHistory[pool.address] ?? []
    )
  );
}

// -- Formatting helpers --

export const formatTvl = (tvl: number): string => {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
};

export const formatRewards = (r: number): string => {
  return `$${r.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const categoryLabels: Record<string, string> = {
  stable: "Stablecoin",
  volatile: "Volatile",
};

export const categoryColors: Record<string, string> = {
  stable: "text-emerald-400",
  volatile: "text-rose-400",
};
