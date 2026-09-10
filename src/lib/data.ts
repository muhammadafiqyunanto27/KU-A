import { query, queryOne } from "@/lib/db";
import type {
  Certificate,
  ClassBackground,
  ClassProfile,
  FinanceSummary,
  FinanceTransaction,
  Portfolio,
  Profile,
} from "@/lib/types";

type Result<T> = { data: T | null; error: string | null };

const PROFILE_COLUMNS = `id, full_name, nickname, role, avatar_url, bio, skills, socials, created_at, updated_at`;

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { data: await fn(), error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Gagal memuat data.",
    };
  }
}

export function getClassProfile(): Promise<Result<ClassProfile | null>> {
  return run(async () => {
    const row = await queryOne<ClassProfile>(
      `select * from class_profile order by updated_at desc limit 1`,
    );
    return row ?? null;
  });
}

export function getClassBackgrounds(): Promise<Result<ClassBackground[]>> {
  return run(async () => {
    return (
      (await query<ClassBackground>(
        `select * from class_backgrounds order by position asc, created_at desc`,
      )) ?? []
    );
  });
}

export function getMembers(): Promise<Result<Profile[]>> {
  return run(async () => {
    return (
      (await query<Profile>(
        `select ${PROFILE_COLUMNS} from profiles order by full_name asc`,
      )) ?? []
    );
  });
}

export function getMemberById(id: string): Promise<Result<Profile | null>> {
  return run(async () => {
    return await queryOne<Profile>(
      `select ${PROFILE_COLUMNS} from profiles where id = $1`,
      [id],
    );
  });
}

export function getPortfoliosByUser(
  userId: string,
): Promise<Result<Portfolio[]>> {
  return run(async () => {
    return (
      (await query<Portfolio>(
        `select * from portfolios where user_id = $1 order by created_at desc`,
        [userId],
      )) ?? []
    );
  });
}

export function getCertificatesByUser(
  userId: string,
): Promise<Result<Certificate[]>> {
  return run(async () => {
    return (
      (await query<Certificate>(
        `select * from certificates where user_id = $1 order by created_at desc`,
        [userId],
      )) ?? []
    );
  });
}

export function getFinanceTransactions(): Promise<Result<FinanceTransaction[]>> {
  return run(async () => {
    return (
      (await query<FinanceTransaction>(
        `select * from finance_transactions order by date desc, created_at desc`,
      )) ?? []
    );
  });
}

export function summarizeFinance(
  transactions: FinanceTransaction[] | null,
): FinanceSummary | null {
  if (!transactions) return null;
  let totalIncome = 0;
  let totalExpense = 0;
  for (const tx of transactions) {
    const amount = Number(tx.amount) || 0;
    if (tx.type === "income") totalIncome += amount;
    else totalExpense += amount;
  }
  return {
    total_income: totalIncome,
    total_expense: totalExpense,
    balance: totalIncome - totalExpense,
    transaction_count: transactions.length,
  };
}