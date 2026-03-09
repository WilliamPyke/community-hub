"use client";

import type { AprComponent } from "@/lib/data";

export function AprBreakdown({
  apr,
  breakdown,
}: {
  apr: number;
  breakdown: AprComponent[];
}) {
  return (
    <div className="relative group/apr">
      <span className="font-mono text-sm font-semibold text-emerald-400 cursor-default">
        {apr.toFixed(2)}%
        {breakdown.length > 1 && (
          <span className="ml-1 text-[10px] text-emerald-500/60">✦</span>
        )}
      </span>

      <div
        className="absolute z-50 top-full mt-2 left-0 w-56 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl shadow-black/40 p-4 opacity-0 invisible group-hover/apr:opacity-100 group-hover/apr:visible transition-all duration-150 pointer-events-none group-hover/apr:pointer-events-auto"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium">Net APR</span>
          <span className="font-mono text-sm font-semibold text-zinc-100">
            {apr.toFixed(2)}%
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
            APR Breakdown
          </span>

          {breakdown.map((component) => (
            <div
              key={component.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    component.type === "base"
                      ? "bg-zinc-500"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="text-xs text-zinc-300">
                  {component.label}
                </span>
              </div>
              <span
                className={`font-mono text-xs font-medium ${
                  component.type === "base"
                    ? "text-zinc-400"
                    : "text-emerald-400"
                }`}
              >
                {component.type === "reward" ? "+" : ""}
                {component.apr.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Total pill */}
        <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full font-mono text-xs font-semibold text-emerald-400">
            {apr.toFixed(2)}%
            {breakdown.length > 1 && (
              <span className="text-emerald-500/60">✦</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
