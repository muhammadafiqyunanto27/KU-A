-- =============================================================
-- KU-A Website Kelas — Schema + Seed (Neon / Postgres)
-- Jalankan sekali di: Neon Console → SQL editor, atau
--   psql "$DATABASE_URL" -f db/0001_schema.sql
--
-- Akses data dikontrol DI SERVER (Next.js): semua query via
-- server action / server component + cek role. TIDAK pakai RLS.
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- profiles: data user + akun login ----------
-- email & password_hash hanya dipakai untuk login (tidak pernah di-query publik).
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  full_name text,
  nickname text,
  role text not null default 'anggota'
    check (role in ('super_admin', 'ketua_kelas', 'wakil_ketua_kelas', 'bendahara', 'sekretaris', 'anggota')),
  avatar_url text,
  bio text,
  skills text[] default '{}',
  socials jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on profiles (lower(email));
create index if not exists profiles_role_idx on profiles (role);

-- ---------- class_profile: konten halaman utama (single row) ----------
create table if not exists class_profile (
  id uuid primary key default gen_random_uuid(),
  class_name text default 'KU-A',
  tagline text,
  description text,
  banner_url text,
  logo_url text,
  socials jsonb,
  contact jsonb,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ---------- class_backgrounds: foto latar slideshow ----------
create table if not exists class_backgrounds (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists class_backgrounds_position_idx on class_backgrounds (position);

-- ---------- portfolios: portofolio per anggota ----------
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  project_url text,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolios_user_id_idx on portfolios (user_id);

-- ---------- finance_transactions: kas class ----------
create table if not exists finance_transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  amount numeric not null default 0 check (amount >= 0),
  description text,
  category text,
  date date not null default current_date,
  receipt_url text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists finance_transactions_date_idx on finance_transactions (date desc);

-- =============================================================
-- SEED — 30 siswa + 1 admin
-- =============================================================

insert into class_profile (class_name)
values ('KU-A')
on conflict do nothing;

-- 30 siswa: username NIS, password = NIS, email <NIS>@ku-a.test
insert into profiles (id, email, password_hash, full_name, nickname, role)
values
  ('00000000-0000-4000-8000-000000000001', '4.43.26.0.01@ku-a.test', crypt('4.43.26.0.01', gen_salt('bf', 10)), 'AL HAQ ERAFIKHA ABDILLAH', '4.43.26.0.01', 'anggota'),
  ('00000000-0000-4000-8000-000000000002', '4.43.26.0.02@ku-a.test', crypt('4.43.26.0.02', gen_salt('bf', 10)), 'ALIESHA DWIANI VEMBITHASYA', '4.43.26.0.02', 'anggota'),
  ('00000000-0000-4000-8000-000000000003', '4.43.26.0.03@ku-a.test', crypt('4.43.26.0.03', gen_salt('bf', 10)), 'ALINA LATIFAHAZRA', '4.43.26.0.03', 'anggota'),
  ('00000000-0000-4000-8000-000000000004', '4.43.26.0.04@ku-a.test', crypt('4.43.26.0.04', gen_salt('bf', 10)), 'AYU', '4.43.26.0.04', 'anggota'),
  ('00000000-0000-4000-8000-000000000005', '4.43.26.0.05@ku-a.test', crypt('4.43.26.0.05', gen_salt('bf', 10)), 'CINDY WIDYASARI', '4.43.26.0.05', 'anggota'),
  ('00000000-0000-4000-8000-000000000006', '4.43.26.0.06@ku-a.test', crypt('4.43.26.0.06', gen_salt('bf', 10)), 'CINTA TRYANI ANWAR', '4.43.26.0.06', 'anggota'),
  ('00000000-0000-4000-8000-000000000007', '4.43.26.0.07@ku-a.test', crypt('4.43.26.0.07', gen_salt('bf', 10)), 'DAVIN ACHMAD RAMADHAN', '4.43.26.0.07', 'anggota'),
  ('00000000-0000-4000-8000-000000000008', '4.43.26.0.08@ku-a.test', crypt('4.43.26.0.08', gen_salt('bf', 10)), 'ELIZABETH DESTALIA NATALI', '4.43.26.0.08', 'anggota'),
  ('00000000-0000-4000-8000-000000000009', '4.43.26.0.09@ku-a.test', crypt('4.43.26.0.09', gen_salt('bf', 10)), 'ELSA SAFIRA PUTRI', '4.43.26.0.09', 'anggota'),
  ('00000000-0000-4000-8000-00000000000a', '4.43.26.0.10@ku-a.test', crypt('4.43.26.0.10', gen_salt('bf', 10)), 'EVA WIJAYAKUSUMA ARINTYA', '4.43.26.0.10', 'anggota'),
  ('00000000-0000-4000-8000-00000000000b', '4.43.26.0.11@ku-a.test', crypt('4.43.26.0.11', gen_salt('bf', 10)), 'FARAH NADIA NUR MEIKA', '4.43.26.0.11', 'anggota'),
  ('00000000-0000-4000-8000-00000000000c', '4.43.26.0.12@ku-a.test', crypt('4.43.26.0.12', gen_salt('bf', 10)), 'GHANIA ALIYA FAZILA', '4.43.26.0.12', 'anggota'),
  ('00000000-0000-4000-8000-00000000000d', '4.43.26.0.13@ku-a.test', crypt('4.43.26.0.13', gen_salt('bf', 10)), 'GRACELINE LUKTA MARTNESYA', '4.43.26.0.13', 'anggota'),
  ('00000000-0000-4000-8000-00000000000e', '4.43.26.0.14@ku-a.test', crypt('4.43.26.0.14', gen_salt('bf', 10)), 'IRNAZ CAHYA NINGRUM', '4.43.26.0.14', 'anggota'),
  ('00000000-0000-4000-8000-00000000000f', '4.43.26.0.15@ku-a.test', crypt('4.43.26.0.15', gen_salt('bf', 10)), 'IZKA IZZATUL MAGHFIROH', '4.43.26.0.15', 'anggota'),
  ('00000000-0000-4000-8000-000000000010', '4.43.26.0.16@ku-a.test', crypt('4.43.26.0.16', gen_salt('bf', 10)), 'KESIA BRIGITA ARDELIA', '4.43.26.0.16', 'anggota'),
  ('00000000-0000-4000-8000-000000000011', '4.43.26.0.17@ku-a.test', crypt('4.43.26.0.17', gen_salt('bf', 10)), 'MARGARETHA PUTRI ANGGRAENY', '4.43.26.0.17', 'anggota'),
  ('00000000-0000-4000-8000-000000000012', '4.43.26.0.18@ku-a.test', crypt('4.43.26.0.18', gen_salt('bf', 10)), 'MARIA CANTIKA VIDIANANDA', '4.43.26.0.18', 'anggota'),
  ('00000000-0000-4000-8000-000000000013', '4.43.26.0.19@ku-a.test', crypt('4.43.26.0.19', gen_salt('bf', 10)), 'MARSAULINA GRACE HERNI SIAHAAN', '4.43.26.0.19', 'anggota'),
  ('00000000-0000-4000-8000-000000000014', '4.43.26.0.20@ku-a.test', crypt('4.43.26.0.20', gen_salt('bf', 10)), 'MUHAMMAD AFIQ YUNANTO', '4.43.26.0.20', 'anggota'),
  ('00000000-0000-4000-8000-000000000015', '4.43.26.0.21@ku-a.test', crypt('4.43.26.0.21', gen_salt('bf', 10)), 'MUHAMMAD JAMALUDDIN', '4.43.26.0.21', 'anggota'),
  ('00000000-0000-4000-8000-000000000016', '4.43.26.0.22@ku-a.test', crypt('4.43.26.0.22', gen_salt('bf', 10)), 'NADIA AMALIA NURSIFY', '4.43.26.0.22', 'anggota'),
  ('00000000-0000-4000-8000-000000000017', '4.43.26.0.23@ku-a.test', crypt('4.43.26.0.23', gen_salt('bf', 10)), 'NAJWA NAILA AZ ZAHRA', '4.43.26.0.23', 'anggota'),
  ('00000000-0000-4000-8000-000000000018', '4.43.26.0.24@ku-a.test', crypt('4.43.26.0.24', gen_salt('bf', 10)), 'RAFIF HANA SALSABILA', '4.43.26.0.24', 'anggota'),
  ('00000000-0000-4000-8000-000000000019', '4.43.26.0.25@ku-a.test', crypt('4.43.26.0.25', gen_salt('bf', 10)), 'SABRINA CITRA CORNEANTO', '4.43.26.0.25', 'anggota'),
  ('00000000-0000-4000-8000-00000000001a', '4.43.26.0.26@ku-a.test', crypt('4.43.26.0.26', gen_salt('bf', 10)), 'SALSABILA TALITA WIJAYANTI', '4.43.26.0.26', 'anggota'),
  ('00000000-0000-4000-8000-00000000001b', '4.43.26.0.27@ku-a.test', crypt('4.43.26.0.27', gen_salt('bf', 10)), 'TASYA SALSABILA NOVITA BASRI', '4.43.26.0.27', 'anggota'),
  ('00000000-0000-4000-8000-00000000001c', '4.43.26.0.28@ku-a.test', crypt('4.43.26.0.28', gen_salt('bf', 10)), 'USSY NOVITASARI', '4.43.26.0.28', 'anggota'),
  ('00000000-0000-4000-8000-00000000001d', '4.43.26.0.29@ku-a.test', crypt('4.43.26.0.29', gen_salt('bf', 10)), 'VIKA AULIA MAGHFUROH', '4.43.26.0.29', 'anggota'),
  ('00000000-0000-4000-8000-00000000001e', '4.43.26.0.30@ku-a.test', crypt('4.43.26.0.30', gen_salt('bf', 10)), 'WARDAHTUL SANI', '4.43.26.0.30', 'anggota')
on conflict (id) do nothing;

-- 1 akun khusus (password random tapi mudah diingat — GANTI setelah first login)
-- Pengurus (ketua/wakil/bendahara/sekretaris) bukanlah user khusus; role diberikan
-- ke siswa oleh Super Admin lewat /dashboard/users.
insert into profiles (id, email, password_hash, full_name, nickname, role)
values
  ('00000000-0000-4000-8000-0000000000fa', 'superadmin@ku-a.test', crypt('BintangTua#91', gen_salt('bf', 10)), 'Super Admin', 'superadmin', 'super_admin')
on conflict (id) do nothing;