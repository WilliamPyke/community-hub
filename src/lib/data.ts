export interface YieldPool {
  id: string;
  protocol: string;
  protocolLogo: string;
  pair: string;
  asset1: string;
  asset2: string;
  apr: number;
  tvl: number;
  dailyRewards: number;
  category: "stable" | "volatile" | "lsd" | "lending";
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
}

const generateHistory = (baseApy: number, baseTvl: number) => {
  const history = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    history.push({
      date: date.toISOString().split("T")[0],
      apy: baseApy + (Math.random() - 0.5) * baseApy * 0.3,
      tvl: baseTvl + (Math.random() - 0.5) * baseTvl * 0.15,
    });
  }
  return history;
};

export const pools: YieldPool[] = [
  {
    id: "mezo-musd-usdc",
    protocol: "Mezo Finance",
    protocolLogo: "MZ",
    pair: "MUSD / USDC",
    asset1: "MUSD",
    asset2: "USDC",
    apr: 14.72,
    tvl: 28_430_000,
    dailyRewards: 11_580,
    category: "stable",
    externalUrl: "https://app.mezo.org/pools/musd-usdc",
    description:
      "Stable pair pool pairing Mezo's native stablecoin with USDC. Low impermanent loss with consistent yield from protocol fees and MEZO token emissions.",
    strategy:
      "Concentrated liquidity AMM position within a tight peg range. The vault auto-rebalances when price deviates beyond 0.2% from the 1:1 peg, capturing arbitrage fees while maintaining capital efficiency.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(14.72, 28_430_000),
    lpBreakdown: [
      { asset: "MUSD", percentage: 51.3, color: "#34d399" },
      { asset: "USDC", percentage: 48.7, color: "#60a5fa" },
    ],
  },
  {
    id: "mezo-btc-eth",
    protocol: "Mezo Finance",
    protocolLogo: "MZ",
    pair: "BTC / ETH",
    asset1: "BTC",
    asset2: "ETH",
    apr: 8.34,
    tvl: 45_120_000,
    dailyRewards: 10_320,
    category: "volatile",
    externalUrl: "https://app.mezo.org/pools/btc-eth",
    description:
      "Major-pair volatile pool capturing trading volume between Bitcoin and Ethereum on Mezo. Higher IL risk offset by significant trading fees.",
    strategy:
      "Wide-range liquidity position optimized for volatility harvesting. Fees are auto-compounded every 4 hours. Rebalancing occurs only when price moves beyond the 5% threshold.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(8.34, 45_120_000),
    lpBreakdown: [
      { asset: "BTC", percentage: 53.8, color: "#f59e0b" },
      { asset: "ETH", percentage: 46.2, color: "#818cf8" },
    ],
  },
  {
    id: "convergence-stbtc",
    protocol: "Convergence",
    protocolLogo: "CV",
    pair: "stBTC",
    asset1: "stBTC",
    asset2: "BTC",
    apr: 6.18,
    tvl: 62_870_000,
    dailyRewards: 10_640,
    category: "lsd",
    externalUrl: "https://convergence.mezo.org/vault/stbtc",
    description:
      "Liquid staking derivative vault for Bitcoin. Earn staking yield plus MEZO incentives by depositing BTC into the Convergence staking protocol.",
    strategy:
      "Native BTC staking through Convergence validators. Yield comes from block rewards distributed to stBTC holders. No impermanent loss as this is single-asset staking.",
    riskChecklist: {
      audited: true,
      timelock: false,
      multiSig: true,
      syntheticAssets: true,
      oracleVerified: true,
    },
    history: generateHistory(6.18, 62_870_000),
    lpBreakdown: [
      { asset: "stBTC", percentage: 100, color: "#f59e0b" },
    ],
  },
  {
    id: "acre-musd-lending",
    protocol: "Acre",
    protocolLogo: "AC",
    pair: "MUSD Lending",
    asset1: "MUSD",
    asset2: "",
    apr: 11.45,
    tvl: 18_640_000,
    dailyRewards: 5_850,
    category: "lending",
    externalUrl: "https://acre.mezo.org/lend/musd",
    description:
      "Supply MUSD to the Acre lending market and earn interest from borrowers. Variable rate adjusts dynamically based on utilization ratio.",
    strategy:
      "Passive lending vault. Deposited MUSD is lent to borrowers who provide over-collateralized positions. Interest accrues per block. No IL risk.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: false,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(11.45, 18_640_000),
    lpBreakdown: [
      { asset: "MUSD", percentage: 100, color: "#34d399" },
    ],
  },
  {
    id: "mezo-eth-musd",
    protocol: "Mezo Finance",
    protocolLogo: "MZ",
    pair: "ETH / MUSD",
    asset1: "ETH",
    asset2: "MUSD",
    apr: 19.87,
    tvl: 12_350_000,
    dailyRewards: 6_720,
    category: "volatile",
    externalUrl: "https://app.mezo.org/pools/eth-musd",
    description:
      "High-yield volatile pair with boosted MEZO emissions. ETH paired with MUSD offers strong directional exposure with elevated rewards.",
    strategy:
      "Aggressive concentrated liquidity within a 15% range. Auto-compounds fees and emissions twice daily. Higher IL risk compensated by boosted emission multiplier.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(19.87, 12_350_000),
    lpBreakdown: [
      { asset: "ETH", percentage: 47.6, color: "#818cf8" },
      { asset: "MUSD", percentage: 52.4, color: "#34d399" },
    ],
  },
  {
    id: "convergence-mats-vault",
    protocol: "Convergence",
    protocolLogo: "CV",
    pair: "MATS Vault",
    asset1: "MATS",
    asset2: "",
    apr: 32.14,
    tvl: 4_210_000,
    dailyRewards: 3_710,
    category: "volatile",
    externalUrl: "https://convergence.mezo.org/vault/mats",
    description:
      "Single-sided MATS staking vault with protocol-boosted emissions. High APR driven by early-stage incentive program.",
    strategy:
      "Lock MATS tokens for protocol governance weight and earn boosted MEZO + MATS dual emissions. 7-day unlock cooldown period applies.",
    riskChecklist: {
      audited: false,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: false,
    },
    history: generateHistory(32.14, 4_210_000),
    lpBreakdown: [
      { asset: "MATS", percentage: 100, color: "#fb7185" },
    ],
  },
  {
    id: "acre-btc-lending",
    protocol: "Acre",
    protocolLogo: "AC",
    pair: "BTC Lending",
    asset1: "BTC",
    asset2: "",
    apr: 4.23,
    tvl: 89_200_000,
    dailyRewards: 10_330,
    category: "lending",
    externalUrl: "https://acre.mezo.org/lend/btc",
    description:
      "Supply BTC to the Acre money market. The most liquid lending pool on Mezo with conservative risk parameters.",
    strategy:
      "Passive BTC lending with institutional-grade risk management. Maximum LTV of 65%. Liquidation threshold at 80%. Interest compounds per block.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(4.23, 89_200_000),
    lpBreakdown: [
      { asset: "BTC", percentage: 100, color: "#f59e0b" },
    ],
  },
  {
    id: "mezo-musd-dai",
    protocol: "Mezo Finance",
    protocolLogo: "MZ",
    pair: "MUSD / DAI",
    asset1: "MUSD",
    asset2: "DAI",
    apr: 9.61,
    tvl: 15_780_000,
    dailyRewards: 4_150,
    category: "stable",
    externalUrl: "https://app.mezo.org/pools/musd-dai",
    description:
      "Stable swap pool for MUSD and DAI. Tight spread with minimal slippage, suitable for large volume stable-to-stable routing.",
    strategy:
      "StableSwap invariant curve optimized for pegged assets. Extremely low IL. Yield driven by swap fees and moderate MEZO emissions.",
    riskChecklist: {
      audited: true,
      timelock: true,
      multiSig: true,
      syntheticAssets: false,
      oracleVerified: true,
    },
    history: generateHistory(9.61, 15_780_000),
    lpBreakdown: [
      { asset: "MUSD", percentage: 50.8, color: "#34d399" },
      { asset: "DAI", percentage: 49.2, color: "#fbbf24" },
    ],
  },
];

export const formatTvl = (tvl: number): string => {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
};

export const formatRewards = (r: number): string => {
  return `$${r.toLocaleString("en-US")}`;
};

export const categoryLabels: Record<string, string> = {
  stable: "Stablecoin",
  volatile: "Volatile",
  lsd: "Liquid Staking",
  lending: "Lending",
  tool: "Developer Tool",
  analytics: "Analytics",
  bridge: "Bridge",
  wallet: "Wallet",
  game: "Gamification",
  social: "Social",
};

export const categoryColors: Record<string, string> = {
  stable: "text-emerald-400",
  volatile: "text-rose-400",
  lsd: "text-amber-400",
  lending: "text-blue-400",
  tool: "text-violet-400",
  analytics: "text-cyan-400",
  bridge: "text-orange-400",
  wallet: "text-lime-400",
  game: "text-pink-400",
  social: "text-teal-400",
};
