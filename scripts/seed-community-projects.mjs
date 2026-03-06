import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

async function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const envFileUrl = new URL("../.env.local", import.meta.url);
    const envFile = await readFile(envFileUrl, "utf8");
    const match = envFile.match(/^DATABASE_URL=(?:"([^"]+)"|(.+))$/m);

    if (match) {
      return match[1] ?? match[2];
    }
  } catch {
    // Ignore missing local env file and fall through to the error below.
  }

  return undefined;
}

const databaseUrl = await getDatabaseUrl();

if (!databaseUrl) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const seedFileUrl = new URL(
  "../Docs/mezo-apps-import/overwrite_community_projects.sql",
  import.meta.url
);
const seedSql = await readFile(seedFileUrl, "utf8");
const statements = seedSql
  .split(/;\s*(?:\r?\n)+/g)
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Seeded community_projects successfully.");
