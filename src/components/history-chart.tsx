"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  date: string;
  apy: number;
  tvl: number;
}

type Metric = "apy" | "tvl";

export function HistoryChart({ data }: { data: DataPoint[] }) {
  const [metric, setMetric] = useState<Metric>("apy");

  const values = data.map((d) => (metric === "apy" ? d.apy : d.tvl));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 100;
  const height = 40;
  const padding = 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;

  const latestValue = values[values.length - 1];
  const firstValue = values[0];
  const change = ((latestValue - firstValue) / firstValue) * 100;

  return (
    <div className="bg-[#141416] rounded-lg border border-zinc-800/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {(["apy", "tvl"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all active:scale-[0.97] ${
                metric === m
                  ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                  : "text-zinc-600 hover:text-zinc-400 border border-transparent"
              }`}
            >
              {m === "apy" ? "APY" : "TVL"}
            </button>
          ))}
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-semibold text-zinc-200">
            {metric === "apy"
              ? `${latestValue.toFixed(2)}%`
              : `$${(latestValue / 1_000_000).toFixed(2)}M`}
          </span>
          <span
            className={`ml-2 font-mono text-xs ${
              change >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        </div>
      </div>

      <motion.svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-32"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#34d399"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      <div className="flex justify-between mt-2 text-[10px] text-zinc-600 font-mono">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
