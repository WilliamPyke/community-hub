import { neon } from "@neondatabase/serverless";

export type CommunityProjectCategory =
  | "DeFi"
  | "Social"
  | "Infra & Tools"
  | "Wallet"
  | "AI";

export interface CommunityProject {
  id: string;
  name: string;
  category: CommunityProjectCategory;
  description: string;
  url: string;
  logo: string;
}

type CommunityProjectRow = {
  slug: string;
  name: string;
  category: CommunityProjectCategory;
  description: string;
  url: string;
  logo_code: string;
};

export const communityCategoryLabels: Record<CommunityProjectCategory, string> = {
  "DeFi": "DeFi",
  "Social": "Social",
  "Infra & Tools": "Infra & Tools",
  "Wallet": "Wallet",
  "AI": "AI",
};

export const communityCategoryColors: Record<CommunityProjectCategory, string> = {
  "DeFi": "text-emerald-400",
  "Social": "text-teal-400",
  "Infra & Tools": "text-cyan-400",
  "Wallet": "text-lime-400",
  "AI": "text-fuchsia-400",
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL for community project queries.");
  }

  return databaseUrl;
}

export async function getCommunityProjects(): Promise<CommunityProject[]> {
  const sql = neon(getDatabaseUrl());
  const rows = await sql.query<false, false>(
    `select
       slug,
       name,
       category::text as category,
       description,
       url,
       logo_code
     from public.community_projects
     order by name asc`
  );

  return (rows as CommunityProjectRow[]).map((row) => ({
    id: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    url: row.url,
    logo: row.logo_code,
  }));
}
