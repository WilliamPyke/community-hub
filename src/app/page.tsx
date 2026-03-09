import { fetchPools } from "@/lib/data";
import { YieldDashboard } from "@/components/yield-dashboard";

export const revalidate = 300; // revalidate every 5 minutes

export default async function Home() {
  const pools = await fetchPools();

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
      {pools.length > 0 ? (
        <YieldDashboard pools={pools} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-zinc-500 text-sm">
            Unable to load pool data. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
