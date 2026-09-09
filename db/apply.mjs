import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const envPath = new URL("../.env.local", import.meta.url);
const envRaw = readFileSync(envPath, "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq > 0) env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const url = env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL kosong di .env.local");
  process.exit(1);
}

const schemaPath = new URL("../db/0001_schema.sql", import.meta.url);
const schema = readFileSync(schemaPath, "utf8");

const sql = neon(url);
const statements = schema
  .split(/;\s*(?:\r?\n|$)/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Schema + seed applied (${statements.length} statements)`);