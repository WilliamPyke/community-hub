"use client";

import { motion } from "framer-motion";

interface Segment {
  asset: string;
  percentage: number;
  color: string;
}

export function DonutChart({ segments }: { segments: Segment[] }) {
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativeOffset = 0;

  return (
    <div className="bg-[#141416] rounded-lg border border-zinc-800/40 p-4 flex flex-col items-center">
      <svg width={size} height={size} className="mb-4">
        {segments.map((seg, i) => {
          const dashLength = (seg.percentage / 100) * circumference;
          const dashGap = circumference - dashLength;
          const offset = -cumulativeOffset;
          cumulativeOffset += dashLength;

          return (
            <motion.circle
              key={seg.asset}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            />
          );
        })}
      </svg>

      <div className="w-full space-y-2">
        {segments.map((seg) => (
          <div key={seg.asset} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-zinc-400">{seg.asset}</span>
            </div>
            <span className="font-mono text-xs text-zinc-300">
              {seg.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
