export type Role =
  | "super_admin"
  | "ketua_kelas"
  | "wakil_ketua_kelas"
  | "bendahara"
  | "sekretaris"
  | "anggota";

export const ROLES: Role[] = [
  "super_admin",
  "ketua_kelas",
  "wakil_ketua_kelas",
  "bendahara",
  "sekretaris",
  "anggota",
];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  ketua_kelas: "Ketua Kelas",
  wakil_ketua_kelas: "Wakil Ketua Kelas",
  bendahara: "Bendahara",
  sekretaris: "Sekretaris",
  anggota: "Anggota",
};

export type Socials = {
  instagram?: string;
  github?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  email?: string;
};

export type Contact = {
  email?: string;
  phone?: string;
  address?: string;
  schedule?: string;
};

export interface Profile {
  id: string;
  full_name: string | null;
  nickname: string | null;
  role: Role;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  socials: Socials | null;
  created_at: string;
  updated_at: string;
}

export interface ClassProfile {
  id: string;
  class_name: string | null;
  tagline: string | null;
  description: string | null;
  banner_url: string | null;
  logo_url: string | null;
  socials: Socials | null;
  contact: Contact | null;
  hero_style: HeroStyle | null;
  updated_by: string | null;
  updated_at: string;
}

export type TextStyle = {
  size?: number;
  color?: string;
  font?: string;
  opacity?: number;
};

export type HeroStyle = {
  class_name?: TextStyle;
  tagline?: TextStyle;
  description?: TextStyle;
};

export interface ClassBackground {
  id: string;
  url: string;
  path: string | null;
  position: number;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "income" | "expense";

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  category: string | null;
  date: string;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface FinanceSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}