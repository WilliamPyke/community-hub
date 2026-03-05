"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowSquareOut,
  ShieldCheck,
  ShieldSlash,
  Clock,
  UsersThree,
  Eye,
  Cube,
} from "@phosphor-icons/react";
import {
  YieldPool,
  formatTvl,
  formatRewards,
  categoryLabels,
  categoryColors,
} from "@/lib/data";
import { HistoryChart } from "./history-chart";
import { DonutChart } from "./donut-chart";

export function PoolDetail({ pool }: { pool: YieldPool }) {
  const risks = [
    {
      label: "Audited",
      value: pool.riskChecklist.audited,
      icon: ShieldCheck,
    },
    {
      label: "Timelock",
      value: pool.riskChecklist.timelock,
      icon: Clock,
    },
    {
      label: "Multi-Sig",
      value: pool.riskChecklist.multiSig,
      icon: UsersThree,
    },
    {
      label: "Synthetic Assets",
      value: pool.riskChecklist.syntheticAssets,
      icon: Cube,
    },
    {
      label: "Oracle Verified",
      value: pool.riskChecklist.oracleVerified,
      icon: Eye,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to yields
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
            <span className="text-sm font-mono font-bold text-zinc-300">
              {pool.protocolLogo}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
              {pool.pair}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-500">{pool.protocol}</span>
              <span
                className={`text-xs font-medium ${
                  categoryColors[pool.category]
                }`}
              >
                {categoryLabels[pool.category]}
              </span>
            </div>
          </div>
        </div>

        <a
          href={pool.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium rounded-lg hover:bg-emerald-500/20 transition-all active:scale-[0.98]"
        >
          Go to Protocol
          <ArrowSquareOut size={15} />
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-zinc-800/40 rounded-lg overflow-hidden mb-8">
        {[
          { label: "APR", value: `${pool.apr.toFixed(2)}%`, accent: true },
          { label: "TVL", value: formatTvl(pool.tvl), accent: false },
          {
            label: "Daily Rewards",
            value: formatRewards(pool.dailyRewards),
            accent: false,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#141416] px-4 py-4">
            <span className="text-xs text-zinc-600 block mb-1">
              {stat.label}
            </span>
            <span
              className={`font-mono text-lg font-semibold ${
                stat.accent ? "text-emerald-400" : "text-zinc-200"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-8">
        <div>
          <h2 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
            Historical Performance
          </h2>
          <HistoryChart data={pool.history} />
        </div>
        <div>
          <h2 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
            LP Breakdown
          </h2>
          <DonutChart segments={pool.lpBreakdown} />
        </div>
      </div>

      {/* Strategy and Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        <div>
          <h2 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
            Strategy
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {pool.strategy}
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed mt-3">
            {pool.description}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
            Risk Checklist
          </h2>
          <div className="space-y-0 divide-y divide-zinc-800/60">
            {risks.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-2">
                  <r.icon
                    size={15}
                    className={
                      r.value ? "text-emerald-400" : "text-zinc-600"
                    }
                  />
                  <span className="text-sm text-zinc-300">{r.label}</span>
                </div>
                {r.value ? (
                  <ShieldCheck
                    size={16}
                    weight="fill"
                    className="text-emerald-400"
                  />
                ) : (
                  <ShieldSlash
                    size={16}
                    weight="fill"
                    className="text-zinc-600"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
