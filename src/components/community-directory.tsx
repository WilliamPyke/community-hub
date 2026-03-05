"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowSquareOut,
  FunnelSimple,
} from "@phosphor-icons/react";
import {
  CommunityProject,
  categoryLabels,
  categoryColors,
} from "@/lib/data";

const categories = [
  "all",
  "tool",
  "analytics",
  "bridge",
  "wallet",
  "game",
  "social",
] as const;

export function CommunityDirectory({
  projects,
}: {
  projects: CommunityProject[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800/30 rounded-lg overflow-hidden">
        {filtered.map((project, i) => (
          <motion.a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0c0c0e] p-5 hover:bg-zinc-900/50 transition-colors group flex gap-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.05,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-bold text-zinc-400">
                {project.logo}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors truncate">
                  {project.name}
                </span>
                <ArrowSquareOut
                  size={12}
                  className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0"
                />
              </div>
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  categoryColors[project.category]
                }`}
              >
                {categoryLabels[project.category]}
              </span>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                {project.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-zinc-600 text-sm">
            No projects found for this category.
          </p>
        </div>
      )}
    </div>
  );
}
