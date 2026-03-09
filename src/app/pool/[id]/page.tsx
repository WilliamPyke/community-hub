import { fetchPools } from "@/lib/data";
import { notFound } from "next/navigation";
import { PoolDetail } from "@/components/pool-detail";

export const revalidate = 300;

export default async function PoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pools = await fetchPools();
  const pool = pools.find((p) => p.id === id);
  if (!pool) notFound();
  return <PoolDetail pool={pool} />;
}
