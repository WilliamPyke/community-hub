import { pools } from "@/lib/data";
import { YieldDashboard } from "@/components/yield-dashboard";

export default function Home() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tighter text-zinc-100">
          Yield Opportunities
        </h1>
        <p className="text-sm text-zinc-500 mt-1.5 max-w-[65ch]">
          Explore DeFi yields across the Mezo network. Data is read-only
          — execute trades on each protocol directly.
        </p>
      </header>
      <YieldDashboard pools={pools} />
    </div>
  );
}
