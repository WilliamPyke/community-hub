"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  FunnelSimple,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import {
  YieldPool,
  formatTvl,
  formatRewards,
  categoryLabels,
  categoryColors,
} from "@/lib/data";
import { AprBreakdown } from "./apr-breakdown";

type SortKey = "apr" | "tvl" | "dailyFees";
type SortDir = "asc" | "desc";

const categories = ["all", "stable", "volatile"] as const;

export function YieldDashboard({ pools }: { pools: YieldPool[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("apr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<string>("all");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let list =
      filter === "all" ? pools : pools.filter((p) => p.category === filter);
    list = [...list].sort((a, b) => {
      const mult = sortDir === "desc" ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mult;
    });
    return list;
  }, [pools, filter, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "desc" ? (
      <ArrowDown size={12} className="inline ml-0.5" />
    ) : (
      <ArrowUp size={12} className="inline ml-0.5" />
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <FunnelSimple size={14} className="text-zinc-600" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 text-xs rounded-md transition-all active:scale-[0.97] ${
              filter === cat
                ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            {cat === "all" ? "All" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs text-zinc-600 font-medium border-b border-zinc-800/60">
        <span>Pool</span>
        <button
          onClick={() => toggleSort("apr")}
          className="text-left hover:text-zinc-400 transition-colors"
        >
          APR <SortIcon col="apr" />
        </button>
        <button
          onClick={() => toggleSort("tvl")}
          className="text-left hover:text-zinc-400 transition-colors"
        >
          TVL <SortIcon col="tvl" />
        </button>
        <button
          onClick={() => toggleSort("dailyFees")}
          className="text-left hover:text-zinc-400 transition-colors"
        >
          Daily Fees <SortIcon col="dailyFees" />
        </button>
        <span>Type</span>
        <span></span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-800/40">
        {filtered.map((pool, i) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.04,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Link
              href={`/pool/${pool.id}`}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-4 py-3.5 hover:bg-zinc-900/50 transition-colors group"
            >
              {/* Pool info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {pool.protocolLogo}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">
                    {pool.pair}
                  </span>
                  <span className="block text-xs text-zinc-600">
                    {pool.poolType}
                  </span>
                </div>
              </div>

              {/* APR with breakdown */}
              <div className="flex items-center md:block">
                <span className="text-xs text-zinc-600 md:hidden mr-2">
                  APR
                </span>
                <AprBreakdown
                  apr={pool.apr}
                  breakdown={pool.aprBreakdown}
                />
              </div>

              {/* TVL */}
              <div className="flex items-center md:block">
                <span className="text-xs text-zinc-600 md:hidden mr-2">
                  TVL
                </span>
                <span className="font-mono text-sm text-zinc-300">
                  {formatTvl(pool.tvl)}
                </span>
              </div>

              {/* Daily Fees */}
              <div className="flex items-center md:block">
                <span className="text-xs text-zinc-600 md:hidden mr-2">
                  Fees
                </span>
                <span className="font-mono text-sm text-zinc-400">
                  {formatRewards(pool.dailyFees)}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center">
                <span
                  className={`text-xs font-medium ${
                    categoryColors[pool.category]
                  }`}
                >
                  {categoryLabels[pool.category]}
                </span>
              </div>

              {/* External link */}
              <div className="flex items-center">
                <ArrowSquareOut
                  size={14}
                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-zinc-600 text-sm">
            No pools found for this filter.
          </p>
        </div>
      )}
    </div>
  );
}
