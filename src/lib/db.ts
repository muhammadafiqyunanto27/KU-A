import { neon } from "@neondatabase/serverless";

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let sql: ReturnType<typeof neon> | null = null;

function getDb() {
  if (!hasDatabase()) throw new Error("Database belum dikonfigurasi");
  if (!sql) sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function query<T>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const rows = await getDb().query(text, params);
  return rows as unknown as T[];
}

export async function queryOne<T>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}